<?php
/**
 * FormGuardian Demo Page
 * Interactive demonstration of the FormGuardian validation library
 */

// Include the global functions
require_once __DIR__ . '/../includes/functions.php';

// Get Bootstrap version from query parameter
$bootstrapVersion = isset($_GET['bs']) ? (int)$_GET['bs'] : 5;
if (!in_array($bootstrapVersion, [3, 4, 5])) {
    $bootstrapVersion = 5;
}

// Get theme from cookie or default
$theme = isset($_COOKIE['fg-theme']) ? $_COOKIE['fg-theme'] : 'light';

// Bootstrap CDN URLs
$bootstrapCDN = [
    3 => [
        'css' => 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
        'js' => 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
        'jquery' => 'https://code.jquery.com/jquery-3.7.1.min.js'
    ],
    4 => [
        'css' => 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
        'js' => 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
        'jquery' => 'https://code.jquery.com/jquery-3.7.1.slim.min.js'
    ],
    5 => [
        'css' => 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        'js' => 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
        'jquery' => null
    ]
];
?>
<!DOCTYPE html>
<html lang="en" data-theme="<?= htmlspecialchars($theme) ?>" data-bs-version="<?= $bootstrapVersion ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FormGuardian Demo - Form Validation Library</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="<?= $bootstrapCDN[$bootstrapVersion]['css'] ?>">

    <!-- FormGuardian CSS -->
    <link rel="stylesheet" href="<?= asset('form-guardian.css') ?>">

    <!-- Demo CSS -->
    <link rel="stylesheet" href="<?= asset('main.css') ?>">

    <!-- Prism.js for syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" id="prism-theme-light">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" id="prism-theme-dark" disabled>
</head>
<body>
    <!-- Header -->
    <header class="fg-demo-header">
        <div class="fg-demo-header-inner">
            <div class="fg-demo-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>FormGuardian</span>
            </div>

            <div class="fg-demo-controls">
                <!-- Bootstrap Version Switcher -->
                <div class="fg-bootstrap-switcher">
                    <label for="bs-version">Bootstrap:</label>
                    <select id="bs-version" class="fg-switcher-select">
                        <option value="3" <?= $bootstrapVersion === 3 ? 'selected' : '' ?>>v3</option>
                        <option value="4" <?= $bootstrapVersion === 4 ? 'selected' : '' ?>>v4</option>
                        <option value="5" <?= $bootstrapVersion === 5 ? 'selected' : '' ?>>v5</option>
                    </select>
                </div>

                <!-- Theme Switcher -->
                <div class="fg-theme-switcher">
                    <button type="button" class="fg-theme-btn" data-theme="light" title="Light theme" aria-label="Light theme">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                    </button>
                    <button type="button" class="fg-theme-btn" data-theme="dark" title="Dark theme" aria-label="Dark theme">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    </button>
                    <button type="button" class="fg-theme-btn" data-theme="system" title="System theme" aria-label="System theme">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Layout -->
    <div class="fg-demo-layout">
        <!-- Sidebar -->
        <aside class="fg-demo-sidebar" id="sidebar">
            <div class="fg-sidebar-header">
                <h2>Validation Rules</h2>
                <button type="button" class="fg-sidebar-close" id="sidebar-close" aria-label="Close sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="fg-sidebar-content" id="sidebar-content">
                <!-- Selected Field Info -->
                <div class="fg-sidebar-section fg-selected-field-section">
                    <h3>Selected Field</h3>
                    <div id="selected-field-info">
                        <div class="fg-no-field-selected">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 12h8"/>
                            </svg>
                            <span>Click a field indicator to select</span>
                        </div>
                    </div>
                    <!-- Hidden field selector for compatibility -->
                    <select id="field-selector" class="fg-sidebar-select" style="display: none;">
                        <option value="">-- Choose a field --</option>
                    </select>
                </div>

                <!-- Applied rules -->
                <div class="fg-sidebar-section fg-applied-rules" id="applied-rules">
                    <h3>Applied Rules</h3>
                    <div class="fg-rules-list" id="applied-rules-list">
                        <p class="fg-no-rules">No rules applied</p>
                    </div>
                </div>

                <!-- Preview Panel with Tabs -->
                <div class="fg-sidebar-section fg-preview-panel" id="preview-panel">
                    <h3>Preview</h3>
                    <div class="fg-preview-tabs">
                        <button type="button" class="fg-preview-tab active" data-tab="preview">Preview</button>
                        <button type="button" class="fg-preview-tab" data-tab="js-config">JS Config</button>
                        <button type="button" class="fg-preview-tab" data-tab="html-dom">HTML DOM</button>
                    </div>
                    <div class="fg-preview-content">
                        <div class="fg-preview-pane active" id="preview-pane-preview">
                            <div class="fg-preview-field-wrapper" id="preview-field-wrapper">
                                <p class="fg-no-field">Select a field to preview</p>
                            </div>
                        </div>
                        <div class="fg-preview-pane" id="preview-pane-js-config">
                            <button type="button" class="fg-copy-btn" data-copy-target="preview-js-config" title="Copy to clipboard">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <pre class="fg-code-block"><code class="language-javascript" id="preview-js-config">// Select a field to see JS configuration</code></pre>
                        </div>
                        <div class="fg-preview-pane" id="preview-pane-html-dom">
                            <button type="button" class="fg-copy-btn" data-copy-target="preview-html-dom" title="Copy to clipboard">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <pre class="fg-code-block"><code class="language-markup" id="preview-html-dom">&lt;!-- Select a field to see HTML --&gt;</code></pre>
                        </div>
                    </div>
                </div>

                <!-- Rule categories accordion -->
                <div class="fg-sidebar-section">
                    <h3>Add Rules</h3>
                    <div class="fg-rule-accordion" id="rule-accordion">
                        <?php include 'includes/rule-categories.php'; ?>
                    </div>
                </div>
            </div>

            <div class="fg-sidebar-resize" id="sidebar-resize"></div>
        </aside>

        <!-- Main Content -->
        <main class="fg-demo-main">
            <div class="fg-demo-content">
                <!-- Sidebar toggle (mobile) -->
                <button type="button" class="fg-sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>

                <h1>FormGuardian Demo</h1>
                <p class="lead">Test the validation library with all form element types. Select a field and add validation rules from the sidebar.</p>

                <!-- Demo Form -->
                <form id="demo-form" class="fg-demo-form" novalidate data-formguardian>
                    <?php include 'includes/form-elements.php'; ?>

                    <!-- Form Actions -->
                    <div class="fg-form-actions <?= $bootstrapVersion === 3 ? 'form-group' : 'mb-4' ?>">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Validate Form
                        </button>
                        <button type="reset" class="btn btn-<?= $bootstrapVersion === 3 ? 'default' : 'secondary' ?> btn-lg">
                            Reset Form
                        </button>
                        <button type="button" class="btn btn-<?= $bootstrapVersion === 3 ? 'default' : 'outline-secondary' ?> btn-lg" id="clear-rules">
                            Clear All Rules
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <?php if ($bootstrapCDN[$bootstrapVersion]['jquery']): ?>
    <script src="<?= $bootstrapCDN[$bootstrapVersion]['jquery'] ?>"></script>
    <?php endif; ?>
    <script src="<?= $bootstrapCDN[$bootstrapVersion]['js'] ?>"></script>

    <!-- Pass config to demo (before scripts) -->
    <script>
        window.FG_DEMO_CONFIG = {
            bootstrapVersion: <?= $bootstrapVersion ?>,
            theme: '<?= htmlspecialchars($theme) ?>'
        };
    </script>

    <!-- FormGuardian Library -->
    <script type="module" src="<?= asset('form-guardian.js') ?>"></script>
    <script nomodule src="<?= asset('form-guardian.js', 'nomodule') ?>"></script>

    <!-- Prism.js for syntax highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js"></script>

    <!-- Demo Application -->
    <script type="module" src="<?= asset('main.js') ?>"></script>
    <script nomodule src="<?= asset('main.js', 'nomodule') ?>"></script>
</body>
</html>
