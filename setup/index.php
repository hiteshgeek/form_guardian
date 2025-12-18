<?php
/**
 * FormGuardian - Setup Guide
 * Documentation for JavaScript API and HTML Data Attributes
 */

require_once __DIR__ . '/../includes/functions.php';

// Get theme from cookie or default
$theme = isset($_COOKIE['fg-theme']) ? $_COOKIE['fg-theme'] : 'light';
?>
<!DOCTYPE html>
<html lang="en" data-theme="<?= htmlspecialchars($theme) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Guide - FormGuardian</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../demo/assets/favicon.svg">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">

    <!-- FormGuardian CSS -->
    <link rel="stylesheet" href="<?= asset('form-guardian.css') ?>">

    <!-- Prism.js for syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">

    <style>
        :root {
            --fg-setup-header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --fg-setup-bg: #f8f9fa;
            --fg-setup-card-bg: #ffffff;
            --fg-setup-text: #212529;
            --fg-setup-text-muted: #6c757d;
            --fg-setup-border: #dee2e6;
            --fg-setup-code-bg: #1e1e3f;
        }

        [data-theme="dark"] {
            --fg-setup-bg: #1a1a2e;
            --fg-setup-card-bg: #16213e;
            --fg-setup-text: #eaeaea;
            --fg-setup-text-muted: #a0a0a0;
            --fg-setup-border: #2a2a4a;
            --fg-setup-code-bg: #0d0d1a;
        }

        body {
            background-color: var(--fg-setup-bg);
            color: var(--fg-setup-text);
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Header */
        .setup-header {
            background: var(--fg-setup-header-bg);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }

        .setup-header h1 {
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .setup-header .lead {
            opacity: 0.9;
            margin-bottom: 1.5rem;
        }

        .setup-header .nav-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            margin-right: 1.5rem;
            transition: color 0.2s;
        }

        .setup-header .nav-links a:hover {
            color: white;
        }

        .setup-header .nav-links svg {
            margin-right: 0.5rem;
            vertical-align: -2px;
        }

        /* Navigation */
        .setup-nav {
            position: sticky;
            top: 1rem;
        }

        .setup-nav .nav-link {
            color: var(--fg-setup-text-muted);
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            margin-bottom: 0.25rem;
            transition: all 0.2s;
        }

        .setup-nav .nav-link:hover {
            color: var(--fg-setup-text);
            background-color: rgba(102, 126, 234, 0.1);
        }

        .setup-nav .nav-link.active {
            color: #667eea;
            background-color: rgba(102, 126, 234, 0.15);
            font-weight: 600;
        }

        .setup-nav .nav-section {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--fg-setup-text-muted);
            padding: 1rem 1rem 0.5rem;
            margin-top: 0.5rem;
        }

        /* Content */
        .setup-content {
            padding-bottom: 4rem;
        }

        .setup-section {
            background-color: var(--fg-setup-card-bg);
            border: 1px solid var(--fg-setup-border);
            border-radius: 0.5rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .setup-section h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #667eea;
            display: inline-block;
        }

        .setup-section h3 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--fg-setup-text);
        }

        .setup-section p {
            color: var(--fg-setup-text-muted);
            line-height: 1.7;
        }

        /* Code blocks */
        .code-block {
            background-color: var(--fg-setup-code-bg);
            border-radius: 0.5rem;
            margin: 1rem 0;
            overflow: hidden;
        }

        .code-block-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            background-color: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-block-title {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.6);
        }

        .code-block-copy {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            transition: all 0.2s;
        }

        .code-block-copy:hover {
            color: white;
            background-color: rgba(255, 255, 255, 0.1);
        }

        .code-block pre {
            margin: 0;
            padding: 1rem;
            overflow-x: auto;
        }

        .code-block code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.85rem;
            line-height: 1.6;
        }

        /* Tables */
        .options-table {
            width: 100%;
            margin: 1rem 0;
            border-collapse: collapse;
        }

        .options-table th,
        .options-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--fg-setup-border);
        }

        .options-table th {
            font-weight: 600;
            background-color: rgba(102, 126, 234, 0.1);
        }

        .options-table code {
            background-color: rgba(102, 126, 234, 0.1);
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-size: 0.85rem;
            color: #667eea;
        }

        [data-theme="dark"] .options-table code {
            background-color: rgba(102, 126, 234, 0.2);
        }

        .options-table .type {
            color: #198754;
            font-size: 0.8rem;
        }

        .options-table .default {
            color: var(--fg-setup-text-muted);
            font-size: 0.85rem;
        }

        /* Method badges */
        .method-badge {
            display: inline-block;
            padding: 0.125rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 0.5rem;
        }

        .method-badge.returns {
            background-color: rgba(25, 135, 84, 0.15);
            color: #198754;
        }

        .method-badge.param {
            background-color: rgba(102, 126, 234, 0.15);
            color: #667eea;
        }

        /* Tabs */
        .setup-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid var(--fg-setup-border);
            padding-bottom: 0;
        }

        .setup-tab {
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: none;
            color: var(--fg-setup-text-muted);
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }

        .setup-tab:hover {
            color: var(--fg-setup-text);
        }

        .setup-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .setup-tab-content {
            display: none;
        }

        .setup-tab-content.active {
            display: block;
        }

        /* Theme switcher */
        .theme-switcher {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
        }

        .theme-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: none;
            background: var(--fg-setup-card-bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--fg-setup-text);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .theme-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        /* Responsive */
        @media (max-width: 991px) {
            .setup-nav-col {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="setup-header">
        <div class="container">
            <div class="nav-links mb-3">
                <a href="../">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Home
                </a>
                <a href="../demo/">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Demo
                </a>
            </div>
            <h1>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -6px; margin-right: 0.5rem;">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                FormGuardian Setup Guide
            </h1>
            <p class="lead">Learn how to integrate FormGuardian using JavaScript API or HTML data attributes.</p>
        </div>
    </header>

    <!-- Main Content -->
    <div class="container">
        <div class="row">
            <!-- Sidebar Navigation -->
            <div class="col-lg-3 setup-nav-col">
                <nav class="setup-nav">
                    <div class="nav-section">Getting Started</div>
                    <a href="#installation" class="nav-link active">Installation</a>
                    <a href="#quick-start" class="nav-link">Quick Start</a>

                    <div class="nav-section">Configuration</div>
                    <a href="#javascript-setup" class="nav-link">JavaScript Setup</a>
                    <a href="#data-attributes" class="nav-link">Data Attributes</a>
                    <a href="#options" class="nav-link">Options Reference</a>

                    <div class="nav-section">Validation</div>
                    <a href="#adding-rules" class="nav-link">Adding Rules</a>
                    <a href="#rule-reference" class="nav-link">Rule Reference</a>
                    <a href="#custom-messages" class="nav-link">Custom Messages</a>

                    <div class="nav-section">Advanced</div>
                    <a href="#methods" class="nav-link">API Methods</a>
                    <a href="#events" class="nav-link">Events</a>
                </nav>
            </div>

            <!-- Content -->
            <div class="col-lg-9">
                <div class="setup-content">

                    <!-- Installation -->
                    <section id="installation" class="setup-section">
                        <h2>Installation</h2>
                        <p>Include the FormGuardian CSS and JavaScript files in your HTML document.</p>

                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">HTML</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-html">&lt;!-- CSS - Add to &lt;head&gt; --&gt;
&lt;link rel="stylesheet" href="dist/css/form-guardian.css"&gt;

&lt;!-- JavaScript - Add before &lt;/body&gt; --&gt;
&lt;!-- ES Module (recommended for modern browsers) --&gt;
&lt;script type="module" src="dist/js/form-guardian.esm.js"&gt;&lt;/script&gt;

&lt;!-- OR IIFE (for older browsers) --&gt;
&lt;script src="dist/js/form-guardian.iife.js"&gt;&lt;/script&gt;</code></pre>
                        </div>

                        <h3>Requirements</h3>
                        <ul>
                            <li>Bootstrap 3, 4, or 5 (CSS framework for styling)</li>
                            <li>No other dependencies required</li>
                        </ul>
                    </section>

                    <!-- Quick Start -->
                    <section id="quick-start" class="setup-section">
                        <h2>Quick Start</h2>
                        <p>Choose your preferred setup method: JavaScript API for full control, or HTML data attributes for quick integration.</p>

                        <div class="setup-tabs">
                            <button class="setup-tab active" data-tab="js-quick">JavaScript</button>
                            <button class="setup-tab" data-tab="html-quick">Data Attributes</button>
                        </div>

                        <div id="js-quick" class="setup-tab-content active">
                            <div class="code-block">
                                <div class="code-block-header">
                                    <span class="code-block-title">JavaScript</span>
                                    <button class="code-block-copy" onclick="copyCode(this)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                                <pre><code class="language-javascript">// Initialize FormGuardian on your form
const validator = new FormGuardian('#myForm', {
    bootstrapVersion: 5,
    showErrorContainer: true
});

// Add validation rules to fields
validator.addField('#email', {
    required: true,
    email: true
});

validator.addField('#password', {
    required: true,
    minLength: 8,
    password: {
        requireUppercase: true,
        requireNumber: true
    }
});</code></pre>
                            </div>
                        </div>

                        <div id="html-quick" class="setup-tab-content">
                            <div class="code-block">
                                <div class="code-block-header">
                                    <span class="code-block-title">HTML</span>
                                    <button class="code-block-copy" onclick="copyCode(this)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                                <pre><code class="language-html">&lt;!-- Add data-formguardian to enable auto-initialization --&gt;
&lt;form id="myForm" data-formguardian data-fg-bootstrap="5"&gt;

    &lt;!-- Add data-fg-rules to define validation rules --&gt;
    &lt;input type="email"
           id="email"
           data-fg-rules='{"required": true, "email": true}'&gt;

    &lt;input type="password"
           id="password"
           data-fg-rules='{"required": true, "minLength": 8, "password": {"requireUppercase": true, "requireNumber": true}}'&gt;

    &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;

&lt;!-- Auto-init all forms with data-formguardian --&gt;
&lt;script&gt;
    FormGuardian.autoInit();
&lt;/script&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- JavaScript Setup -->
                    <section id="javascript-setup" class="setup-section">
                        <h2>JavaScript Setup</h2>
                        <p>The JavaScript API provides full control over form validation with programmatic rule management and event handling.</p>

                        <h3>Basic Initialization</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">// Basic initialization
const validator = new FormGuardian('#myForm');

// With options
const validator = new FormGuardian('#myForm', {
    bootstrapVersion: 5,           // 3, 4, 5, or 'auto'
    validateOn: ['blur', 'submit'], // When to validate
    liveValidation: true,          // Validate on input
    debounceMs: 300,               // Debounce delay
    showErrorContainer: true,      // Show error panel
    errorContainerPosition: 'right-bottom', // Panel position
    showLabelTooltips: true,       // Show rules on labels
    scrollToError: true,           // Scroll to first error
    focusOnError: true             // Focus first error field
});</code></pre>
                        </div>

                        <h3>Adding Fields with Rules</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">// Add field by selector (ID, name, or element)
validator.addField('#username', {
    required: true,
    minLength: 3,
    maxLength: 20,
    alphaNumeric: true
});

// Add field with custom error messages
validator.addField('#email', {
    required: true,
    email: true
}, {
    required: 'Please enter your email address',
    email: 'Please enter a valid email format'
});

// Chain multiple fields
validator
    .addField('#firstName', { required: true, alpha: true })
    .addField('#lastName', { required: true, alpha: true })
    .addField('#age', { required: true, integer: true, min: 18 });</code></pre>
                        </div>

                        <h3>Dynamic Rule Management</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">// Add a single rule to an existing field
validator.addRule('#password', 'minLength', { min: 12 });

// Remove a rule from a field
validator.removeRule('#password', 'minLength');

// Remove a field entirely
validator.removeField('#optionalField');

// Get field configuration
const fieldConfig = validator.getField('#email');</code></pre>
                        </div>

                        <h3>Manual Validation</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">// Validate entire form
const isValid = await validator.validate();

// Validate a single field
const isFieldValid = await validator.validateField('#email');

// Check if form is currently valid
if (validator.isValid()) {
    // Submit form
}

// Get all current errors
const errors = validator.getErrors();

// Clear all errors
validator.clearErrors();</code></pre>
                        </div>
                    </section>

                    <!-- Data Attributes -->
                    <section id="data-attributes" class="setup-section">
                        <h2>Data Attributes Setup</h2>
                        <p>Use HTML data attributes for declarative validation without writing JavaScript. Perfect for server-rendered pages and PHP integration.</p>

                        <h3>Form Attributes</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Description</th>
                                    <th>Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>data-formguardian</code></td>
                                    <td>Enable FormGuardian on this form</td>
                                    <td><code>&lt;form data-formguardian&gt;</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-bootstrap</code></td>
                                    <td>Bootstrap version (3, 4, 5, or auto)</td>
                                    <td><code>data-fg-bootstrap="5"</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-validate-on</code></td>
                                    <td>Events to trigger validation</td>
                                    <td><code>data-fg-validate-on="blur,change"</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-live</code></td>
                                    <td>Enable/disable live validation</td>
                                    <td><code>data-fg-live="true"</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-error-container</code></td>
                                    <td>Show/hide error container panel</td>
                                    <td><code>data-fg-error-container="true"</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-label-tooltips</code></td>
                                    <td>Show validation rules on field labels</td>
                                    <td><code>data-fg-label-tooltips="true"</code></td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Field Attributes</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Description</th>
                                    <th>Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>data-fg-rules</code></td>
                                    <td>JSON object defining validation rules</td>
                                    <td><code>data-fg-rules='{"required": true}'</code></td>
                                </tr>
                                <tr>
                                    <td><code>data-fg-messages</code></td>
                                    <td>JSON object with custom error messages</td>
                                    <td><code>data-fg-messages='{"required": "This is required"}'</code></td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Complete Example</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">HTML</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-html">&lt;form id="registrationForm"
      data-formguardian
      data-fg-bootstrap="5"
      data-fg-error-container="true"
      data-fg-label-tooltips="true"&gt;

    &lt;div class="mb-3"&gt;
        &lt;label for="username" class="form-label"&gt;Username&lt;/label&gt;
        &lt;input type="text"
               class="form-control"
               id="username"
               data-fg-rules='{"required": true, "minLength": 3, "maxLength": 20, "alphaNumeric": true}'
               data-fg-messages='{"required": "Username is required", "minLength": "Username must be at least 3 characters"}'&gt;
    &lt;/div&gt;

    &lt;div class="mb-3"&gt;
        &lt;label for="email" class="form-label"&gt;Email&lt;/label&gt;
        &lt;input type="email"
               class="form-control"
               id="email"
               data-fg-rules='{"required": true, "email": true}'&gt;
    &lt;/div&gt;

    &lt;div class="mb-3"&gt;
        &lt;label for="password" class="form-label"&gt;Password&lt;/label&gt;
        &lt;input type="password"
               class="form-control"
               id="password"
               data-fg-rules='{"required": true, "minLength": 8, "password": {"requireUppercase": true, "requireLowercase": true, "requireNumber": true}}'&gt;
    &lt;/div&gt;

    &lt;div class="mb-3"&gt;
        &lt;label for="age" class="form-label"&gt;Age&lt;/label&gt;
        &lt;input type="number"
               class="form-control"
               id="age"
               data-fg-rules='{"required": true, "integer": true, "min": 18, "max": 120}'&gt;
    &lt;/div&gt;

    &lt;button type="submit" class="btn btn-primary"&gt;Register&lt;/button&gt;
&lt;/form&gt;

&lt;script&gt;
    // Auto-initialize all forms with data-formguardian
    FormGuardian.autoInit();
&lt;/script&gt;</code></pre>
                        </div>

                        <h3>PHP Integration Example</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">PHP</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-php">&lt;?php
// Define validation rules in PHP
$rules = [
    'email' => ['required' => true, 'email' => true],
    'password' => ['required' => true, 'minLength' => 8]
];
?&gt;

&lt;form data-formguardian data-fg-bootstrap="5"&gt;
    &lt;input type="email"
           id="email"
           data-fg-rules='&lt;?= htmlspecialchars(json_encode($rules['email'])) ?&gt;'&gt;

    &lt;input type="password"
           id="password"
           data-fg-rules='&lt;?= htmlspecialchars(json_encode($rules['password'])) ?&gt;'&gt;

    &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
                        </div>
                    </section>

                    <!-- Options Reference -->
                    <section id="options" class="setup-section">
                        <h2>Options Reference</h2>
                        <p>Complete list of configuration options available when initializing FormGuardian.</p>

                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Option</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>bootstrapVersion</code></td>
                                    <td><span class="type">number|string</span></td>
                                    <td><span class="default">'auto'</span></td>
                                    <td>Bootstrap version: 3, 4, 5, or 'auto' for detection</td>
                                </tr>
                                <tr>
                                    <td><code>validateOn</code></td>
                                    <td><span class="type">array</span></td>
                                    <td><span class="default">['blur', 'submit']</span></td>
                                    <td>Events that trigger validation</td>
                                </tr>
                                <tr>
                                    <td><code>liveValidation</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">true</span></td>
                                    <td>Enable validation on input with debounce</td>
                                </tr>
                                <tr>
                                    <td><code>debounceMs</code></td>
                                    <td><span class="type">number</span></td>
                                    <td><span class="default">300</span></td>
                                    <td>Debounce delay in milliseconds</td>
                                </tr>
                                <tr>
                                    <td><code>showErrorContainer</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">true</span></td>
                                    <td>Show floating error container panel</td>
                                </tr>
                                <tr>
                                    <td><code>errorContainerPosition</code></td>
                                    <td><span class="type">string</span></td>
                                    <td><span class="default">'left-bottom'</span></td>
                                    <td>Position: 'left-bottom', 'right-bottom', 'left-top', 'right-top'</td>
                                </tr>
                                <tr>
                                    <td><code>errorContainerHeight</code></td>
                                    <td><span class="type">number</span></td>
                                    <td><span class="default">200</span></td>
                                    <td>Maximum height of error container in pixels</td>
                                </tr>
                                <tr>
                                    <td><code>showLabelTooltips</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">false</span></td>
                                    <td>Show validation rules tooltip on field labels</td>
                                </tr>
                                <tr>
                                    <td><code>labelTooltipTitle</code></td>
                                    <td><span class="type">string</span></td>
                                    <td><span class="default">'Validation Rules'</span></td>
                                    <td>Title text for label tooltips</td>
                                </tr>
                                <tr>
                                    <td><code>scrollToError</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">true</span></td>
                                    <td>Scroll to first error on form submit</td>
                                </tr>
                                <tr>
                                    <td><code>focusOnError</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">true</span></td>
                                    <td>Focus first error field on form submit</td>
                                </tr>
                                <tr>
                                    <td><code>stopOnFirstError</code></td>
                                    <td><span class="type">boolean</span></td>
                                    <td><span class="default">false</span></td>
                                    <td>Stop validation on first error found</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Adding Rules -->
                    <section id="adding-rules" class="setup-section">
                        <h2>Adding Validation Rules</h2>
                        <p>Rules can be added as simple boolean values or with configuration objects.</p>

                        <h3>Simple Rules (Boolean)</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">validator.addField('#field', {
    required: true,      // Field must have a value
    email: true,         // Must be valid email
    alpha: true,         // Letters only
    numeric: true,       // Numbers only
    integer: true,       // Integer only
    url: true           // Valid URL
});</code></pre>
                        </div>

                        <h3>Rules with Parameters</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">validator.addField('#field', {
    // Shorthand: single value parameter
    minLength: 5,        // Minimum 5 characters
    maxLength: 100,      // Maximum 100 characters
    min: 0,              // Minimum value
    max: 1000,           // Maximum value

    // Object: multiple parameters
    range: { min: 1, max: 100 },
    rangeLength: { min: 5, max: 50 },
    password: {
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: true,
        minLength: 8
    },
    regex: { pattern: '^[A-Z]{3}\\d{4}$' },
    fileSize: { maxSize: 5242880 }  // 5MB
});</code></pre>
                        </div>

                        <h3>Data Attribute Format</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">HTML</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-html">&lt;!-- Simple rules --&gt;
&lt;input data-fg-rules='{"required": true, "email": true}'&gt;

&lt;!-- Rules with parameters --&gt;
&lt;input data-fg-rules='{"minLength": 5, "maxLength": 100}'&gt;

&lt;!-- Complex rules --&gt;
&lt;input data-fg-rules='{"password": {"requireUppercase": true, "requireNumber": true, "minLength": 8}}'&gt;</code></pre>
                        </div>
                    </section>

                    <!-- Rule Reference -->
                    <section id="rule-reference" class="setup-section">
                        <h2>Rule Reference</h2>
                        <p>Complete list of available validation rules grouped by category.</p>

                        <h3>String Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>required</code></td><td>-</td><td>Field must have a value</td></tr>
                                <tr><td><code>minLength</code></td><td><code>min</code></td><td>Minimum character count</td></tr>
                                <tr><td><code>maxLength</code></td><td><code>max</code></td><td>Maximum character count</td></tr>
                                <tr><td><code>exactLength</code></td><td><code>length</code></td><td>Exact character count</td></tr>
                                <tr><td><code>rangeLength</code></td><td><code>min, max</code></td><td>Between min and max characters</td></tr>
                                <tr><td><code>alpha</code></td><td>-</td><td>Letters only (a-zA-Z)</td></tr>
                                <tr><td><code>alphaNumeric</code></td><td>-</td><td>Letters and numbers only</td></tr>
                                <tr><td><code>alphaSpace</code></td><td>-</td><td>Letters and spaces only</td></tr>
                                <tr><td><code>alphaDash</code></td><td>-</td><td>Letters, numbers, dashes, underscores</td></tr>
                                <tr><td><code>noWhitespace</code></td><td>-</td><td>No whitespace allowed</td></tr>
                                <tr><td><code>contains</code></td><td><code>value</code></td><td>Must contain substring</td></tr>
                                <tr><td><code>startsWith</code></td><td><code>value</code></td><td>Must start with string</td></tr>
                                <tr><td><code>endsWith</code></td><td><code>value</code></td><td>Must end with string</td></tr>
                            </tbody>
                        </table>

                        <h3>Pattern Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>email</code></td><td>-</td><td>Valid email format</td></tr>
                                <tr><td><code>url</code></td><td>-</td><td>Valid URL format</td></tr>
                                <tr><td><code>phone</code></td><td>-</td><td>Phone number format</td></tr>
                                <tr><td><code>creditCard</code></td><td>-</td><td>Credit card with Luhn check</td></tr>
                                <tr><td><code>uuid</code></td><td>-</td><td>UUID format</td></tr>
                                <tr><td><code>hexColor</code></td><td>-</td><td>Hex color code (#RGB or #RRGGBB)</td></tr>
                                <tr><td><code>ipAddress</code></td><td>-</td><td>IPv4 or IPv6 address</td></tr>
                                <tr><td><code>password</code></td><td><code>requireUppercase, requireLowercase, requireNumber, requireSpecial, minLength</code></td><td>Password complexity</td></tr>
                                <tr><td><code>regex</code></td><td><code>pattern, flags</code></td><td>Custom regex pattern</td></tr>
                            </tbody>
                        </table>

                        <h3>Number Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>numeric</code></td><td>-</td><td>Must be a number</td></tr>
                                <tr><td><code>integer</code></td><td>-</td><td>Must be an integer</td></tr>
                                <tr><td><code>float</code></td><td>-</td><td>Must be a decimal number</td></tr>
                                <tr><td><code>positive</code></td><td>-</td><td>Must be positive</td></tr>
                                <tr><td><code>negative</code></td><td>-</td><td>Must be negative</td></tr>
                                <tr><td><code>min</code></td><td><code>min</code></td><td>Minimum value</td></tr>
                                <tr><td><code>max</code></td><td><code>max</code></td><td>Maximum value</td></tr>
                                <tr><td><code>range</code></td><td><code>min, max</code></td><td>Between min and max</td></tr>
                                <tr><td><code>divisibleBy</code></td><td><code>divisor</code></td><td>Divisible by number</td></tr>
                            </tbody>
                        </table>

                        <h3>Date Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>date</code></td><td>-</td><td>Valid date</td></tr>
                                <tr><td><code>dateAfter</code></td><td><code>date</code></td><td>After specified date</td></tr>
                                <tr><td><code>dateBefore</code></td><td><code>date</code></td><td>Before specified date</td></tr>
                                <tr><td><code>dateBetween</code></td><td><code>min, max</code></td><td>Between dates</td></tr>
                                <tr><td><code>age</code></td><td><code>minAge</code></td><td>Minimum age</td></tr>
                                <tr><td><code>futureDate</code></td><td>-</td><td>Must be in future</td></tr>
                                <tr><td><code>pastDate</code></td><td>-</td><td>Must be in past</td></tr>
                            </tbody>
                        </table>

                        <h3>File Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>fileRequired</code></td><td>-</td><td>File must be selected</td></tr>
                                <tr><td><code>fileSize</code></td><td><code>maxSize</code></td><td>Max file size in bytes</td></tr>
                                <tr><td><code>fileMinSize</code></td><td><code>minSize</code></td><td>Min file size in bytes</td></tr>
                                <tr><td><code>fileType</code></td><td><code>types</code></td><td>Allowed MIME types</td></tr>
                                <tr><td><code>fileExtension</code></td><td><code>extensions</code></td><td>Allowed extensions</td></tr>
                                <tr><td><code>imageOnly</code></td><td>-</td><td>Images only</td></tr>
                                <tr><td><code>maxFiles</code></td><td><code>max</code></td><td>Maximum file count</td></tr>
                            </tbody>
                        </table>

                        <h3>Comparison Rules</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Parameters</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><code>equals</code></td><td><code>value</code></td><td>Must equal value</td></tr>
                                <tr><td><code>notEquals</code></td><td><code>value</code></td><td>Must not equal value</td></tr>
                                <tr><td><code>confirmedBy</code></td><td><code>field</code></td><td>Must match another field</td></tr>
                                <tr><td><code>requiredIf</code></td><td><code>field, value</code></td><td>Required if condition</td></tr>
                                <tr><td><code>requiredWith</code></td><td><code>field</code></td><td>Required with other field</td></tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Custom Messages -->
                    <section id="custom-messages" class="setup-section">
                        <h2>Custom Error Messages</h2>
                        <p>Customize error messages for any validation rule.</p>

                        <h3>JavaScript API</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">// Pass messages as third parameter to addField
validator.addField('#email', {
    required: true,
    email: true
}, {
    required: 'Email address is required',
    email: 'Please enter a valid email address'
});

// Dynamic messages with placeholders
validator.addField('#password', {
    required: true,
    minLength: 8
}, {
    required: 'Password is required',
    minLength: 'Password must be at least {min} characters'
});</code></pre>
                        </div>

                        <h3>Data Attributes</h3>
                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">HTML</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-html">&lt;input type="email"
       id="email"
       data-fg-rules='{"required": true, "email": true}'
       data-fg-messages='{"required": "Email address is required", "email": "Please enter a valid email"}'&gt;</code></pre>
                        </div>
                    </section>

                    <!-- Methods -->
                    <section id="methods" class="setup-section">
                        <h2>API Methods</h2>
                        <p>Methods available on the FormGuardian instance.</p>

                        <h3>Field Management</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Returns</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>addField(selector, rules, messages)</code></td>
                                    <td><span class="method-badge returns">FormGuardian</span></td>
                                    <td>Add field with validation rules</td>
                                </tr>
                                <tr>
                                    <td><code>removeField(selector)</code></td>
                                    <td><span class="method-badge returns">FormGuardian</span></td>
                                    <td>Remove field from validation</td>
                                </tr>
                                <tr>
                                    <td><code>getField(selector)</code></td>
                                    <td><span class="method-badge returns">Object|null</span></td>
                                    <td>Get field configuration</td>
                                </tr>
                                <tr>
                                    <td><code>addRule(selector, ruleName, config)</code></td>
                                    <td><span class="method-badge returns">FormGuardian</span></td>
                                    <td>Add rule to existing field</td>
                                </tr>
                                <tr>
                                    <td><code>removeRule(selector, ruleName)</code></td>
                                    <td><span class="method-badge returns">FormGuardian</span></td>
                                    <td>Remove rule from field</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Validation</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Returns</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>validate()</code></td>
                                    <td><span class="method-badge returns">Promise&lt;boolean&gt;</span></td>
                                    <td>Validate all fields</td>
                                </tr>
                                <tr>
                                    <td><code>validateField(selector)</code></td>
                                    <td><span class="method-badge returns">Promise&lt;boolean&gt;</span></td>
                                    <td>Validate single field</td>
                                </tr>
                                <tr>
                                    <td><code>isValid()</code></td>
                                    <td><span class="method-badge returns">boolean</span></td>
                                    <td>Check if form is valid</td>
                                </tr>
                                <tr>
                                    <td><code>getErrors()</code></td>
                                    <td><span class="method-badge returns">Map</span></td>
                                    <td>Get all current errors</td>
                                </tr>
                                <tr>
                                    <td><code>clearErrors()</code></td>
                                    <td><span class="method-badge returns">void</span></td>
                                    <td>Clear all errors</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Lifecycle</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Returns</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>destroy()</code></td>
                                    <td><span class="method-badge returns">void</span></td>
                                    <td>Clean up and remove instance</td>
                                </tr>
                                <tr>
                                    <td><code>updateLabelTooltips()</code></td>
                                    <td><span class="method-badge returns">void</span></td>
                                    <td>Refresh label tooltips</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Static Methods</h3>
                        <table class="options-table">
                            <thead>
                                <tr>
                                    <th>Method</th>
                                    <th>Returns</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>FormGuardian.getInstance(form)</code></td>
                                    <td><span class="method-badge returns">FormGuardian|null</span></td>
                                    <td>Get existing instance for form</td>
                                </tr>
                                <tr>
                                    <td><code>FormGuardian.initFromDataAttributes(form)</code></td>
                                    <td><span class="method-badge returns">FormGuardian</span></td>
                                    <td>Initialize from data attributes</td>
                                </tr>
                                <tr>
                                    <td><code>FormGuardian.autoInit()</code></td>
                                    <td><span class="method-badge returns">FormGuardian[]</span></td>
                                    <td>Initialize all forms with data-formguardian</td>
                                </tr>
                                <tr>
                                    <td><code>FormGuardian.getRules()</code></td>
                                    <td><span class="method-badge returns">Object</span></td>
                                    <td>Get all available validation rules</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Events -->
                    <section id="events" class="setup-section">
                        <h2>Events</h2>
                        <p>FormGuardian dispatches custom events that you can listen to.</p>

                        <div class="code-block">
                            <div class="code-block-header">
                                <span class="code-block-title">JavaScript</span>
                                <button class="code-block-copy" onclick="copyCode(this)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                            <pre><code class="language-javascript">const form = document.getElementById('myForm');

// Form validated event
form.addEventListener('fg:validated', (e) => {
    console.log('Form validated:', e.detail.isValid);
    console.log('Errors:', e.detail.errors);
});

// Field validated event
form.addEventListener('fg:field:validated', (e) => {
    console.log('Field:', e.detail.field);
    console.log('Valid:', e.detail.isValid);
    console.log('Message:', e.detail.message);
});

// Form submit event (when valid)
form.addEventListener('fg:submit', (e) => {
    console.log('Form is valid and ready to submit');
    // Process form data
});</code></pre>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    </div>

    <!-- Theme Switcher -->
    <div class="theme-switcher">
        <button type="button" class="theme-btn" id="theme-toggle" title="Toggle theme">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="theme-icon-light">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="theme-icon-dark" style="display: none;">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        </button>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup-templating.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-php.min.js"></script>

    <script>
        // Tab switching
        document.querySelectorAll('.setup-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                const container = tab.closest('.setup-section');

                // Update tab states
                container.querySelectorAll('.setup-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update content states
                container.querySelectorAll('.setup-tab-content').forEach(c => c.classList.remove('active'));
                container.querySelector(`#${tabId}`).classList.add('active');
            });
        });

        // Copy code functionality
        function copyCode(button) {
            const codeBlock = button.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;

            navigator.clipboard.writeText(code).then(() => {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                button.style.color = '#198754';

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.color = '';
                }, 2000);
            });
        }

        // Smooth scroll for navigation
        document.querySelectorAll('.setup-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Update active state
                    document.querySelectorAll('.setup-nav .nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav on scroll
        const sections = document.querySelectorAll('.setup-section');
        const navLinks = document.querySelectorAll('.setup-nav .nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const lightIcon = document.getElementById('theme-icon-light');
        const darkIcon = document.getElementById('theme-icon-dark');

        function updateThemeIcons() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            lightIcon.style.display = isDark ? 'block' : 'none';
            darkIcon.style.display = isDark ? 'none' : 'block';
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            document.cookie = `fg-theme=${newTheme};path=/;max-age=31536000`;
            updateThemeIcons();
        });

        updateThemeIcons();
    </script>
</body>
</html>
