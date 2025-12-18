<?php
/**
 * FormGuardian - Form Validation Library
 * Main landing page
 */

require_once __DIR__ . '/includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FormGuardian - Form Validation Library</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?= asset('form-guardian.css') ?>">
    <style>
        :root {
            --fg-gradient-start: #667eea;
            --fg-gradient-end: #764ba2;
        }

        body {
            min-height: 100vh;
            background: linear-gradient(135deg, var(--fg-gradient-start) 0%, var(--fg-gradient-end) 100%);
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .hero {
            padding: 4rem 0;
            text-align: center;
            color: white;
        }

        .hero-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .hero-icon svg {
            width: 48px;
            height: 48px;
            color: white;
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .hero .lead {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
        }

        .btn-demo {
            padding: 0.75rem 2rem;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 50px;
            background: white;
            color: var(--fg-gradient-start);
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-demo:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            color: var(--fg-gradient-end);
        }

        .features {
            padding: 4rem 0;
            background: white;
        }

        .feature-card {
            padding: 2rem;
            text-align: center;
            border-radius: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            padding: 0.75rem;
            background: linear-gradient(135deg, var(--fg-gradient-start), var(--fg-gradient-end));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .feature-icon svg {
            width: 28px;
            height: 28px;
            color: white;
        }

        .feature-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #1a1a2e;
        }

        .feature-card p {
            color: #6c757d;
            margin-bottom: 0;
        }

        .installation {
            padding: 4rem 0;
            background: #f8f9fa;
        }

        .installation h2 {
            font-weight: 700;
            margin-bottom: 2rem;
            color: #1a1a2e;
        }

        .code-block {
            background: #1a1a2e;
            color: #e9ecef;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .code-block .comment {
            color: #6c757d;
        }

        .code-block .keyword {
            color: #c792ea;
        }

        .code-block .string {
            color: #c3e88d;
        }

        .code-block .function {
            color: #82aaff;
        }

        .rules-section {
            padding: 4rem 0;
            background: white;
        }

        .rules-section h2 {
            font-weight: 700;
            margin-bottom: 2rem;
            color: #1a1a2e;
        }

        .rule-category {
            margin-bottom: 1.5rem;
        }

        .rule-category h4 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--fg-gradient-start);
            margin-bottom: 0.5rem;
        }

        .rule-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .rule-badge {
            padding: 0.25rem 0.75rem;
            background: #f0f0f5;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #495057;
        }

        .footer {
            padding: 2rem 0;
            background: #1a1a2e;
            color: white;
            text-align: center;
        }

        .footer a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
        }

        .footer a:hover {
            color: white;
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            </div>
            <h1>FormGuardian</h1>
            <p class="lead">A powerful, lightweight vanilla JavaScript form validation library with Bootstrap 3, 4, and 5 support. No dependencies required.</p>
            <a href="demo/" class="btn btn-demo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: -4px;">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                View Demo
            </a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h3>Bootstrap Support</h3>
                        <p>Works seamlessly with Bootstrap 3, 4, and 5. Auto-detects version or set manually.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <h3>50+ Validation Rules</h3>
                        <p>Comprehensive rule set including string, pattern, number, date, file, and async validations.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="3" y1="9" x2="21" y2="9"/>
                                <line x1="9" y1="21" x2="9" y2="9"/>
                            </svg>
                        </div>
                        <h3>Error Container</h3>
                        <p>Floating error panel with bidirectional highlighting. Click error to focus field.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                        </div>
                        <h3>Highly Configurable</h3>
                        <p>Customize validation triggers, debouncing, error display, and more.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        </div>
                        <h3>Theme Support</h3>
                        <p>Built-in light and dark themes with CSS custom properties for easy customization.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="4 17 10 11 4 5"/>
                                <line x1="12" y1="19" x2="20" y2="19"/>
                            </svg>
                        </div>
                        <h3>Data Attributes</h3>
                        <p>Initialize validation from HTML data attributes. Perfect for PHP integration.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Installation Section -->
    <section class="installation">
        <div class="container">
            <h2 class="text-center">Quick Start</h2>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="code-block">
                        <span class="comment">// Include CSS</span><br>
                        &lt;link rel="stylesheet" href="<span class="string">dist/css/form-guardian.css</span>"&gt;<br><br>

                        <span class="comment">// Include JS</span><br>
                        &lt;script src="<span class="string">dist/js/form-guardian.js</span>"&gt;&lt;/script&gt;<br><br>

                        <span class="comment">// Initialize</span><br>
                        <span class="keyword">const</span> validator = <span class="keyword">new</span> <span class="function">FormGuardian</span>(<span class="string">'#myForm'</span>, {<br>
                        &nbsp;&nbsp;bootstrapVersion: <span class="string">5</span>,<br>
                        &nbsp;&nbsp;showErrorContainer: <span class="keyword">true</span><br>
                        });<br><br>

                        <span class="comment">// Add validation rules</span><br>
                        validator.<span class="function">addField</span>(<span class="string">'#email'</span>, {<br>
                        &nbsp;&nbsp;required: <span class="keyword">true</span>,<br>
                        &nbsp;&nbsp;email: <span class="keyword">true</span><br>
                        });<br><br>

                        validator.<span class="function">addField</span>(<span class="string">'#password'</span>, {<br>
                        &nbsp;&nbsp;required: <span class="keyword">true</span>,<br>
                        &nbsp;&nbsp;minLength: <span class="string">8</span>,<br>
                        &nbsp;&nbsp;password: { requireUppercase: <span class="keyword">true</span>, requireNumber: <span class="keyword">true</span> }<br>
                        });
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Validation Rules Section -->
    <section class="rules-section">
        <div class="container">
            <h2 class="text-center">Validation Rules</h2>
            <div class="row">
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>String Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">required</span>
                            <span class="rule-badge">minLength</span>
                            <span class="rule-badge">maxLength</span>
                            <span class="rule-badge">alpha</span>
                            <span class="rule-badge">alphaNumeric</span>
                            <span class="rule-badge">contains</span>
                            <span class="rule-badge">startsWith</span>
                            <span class="rule-badge">endsWith</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>Pattern Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">email</span>
                            <span class="rule-badge">url</span>
                            <span class="rule-badge">phone</span>
                            <span class="rule-badge">creditCard</span>
                            <span class="rule-badge">password</span>
                            <span class="rule-badge">uuid</span>
                            <span class="rule-badge">regex</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>Number Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">numeric</span>
                            <span class="rule-badge">integer</span>
                            <span class="rule-badge">min</span>
                            <span class="rule-badge">max</span>
                            <span class="rule-badge">range</span>
                            <span class="rule-badge">positive</span>
                            <span class="rule-badge">divisibleBy</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>Date Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">date</span>
                            <span class="rule-badge">dateAfter</span>
                            <span class="rule-badge">dateBefore</span>
                            <span class="rule-badge">age</span>
                            <span class="rule-badge">futureDate</span>
                            <span class="rule-badge">pastDate</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>File Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">fileRequired</span>
                            <span class="rule-badge">fileSize</span>
                            <span class="rule-badge">fileType</span>
                            <span class="rule-badge">imageOnly</span>
                            <span class="rule-badge">maxFiles</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="rule-category">
                        <h4>Comparison Rules</h4>
                        <div class="rule-list">
                            <span class="rule-badge">equals</span>
                            <span class="rule-badge">confirmedBy</span>
                            <span class="rule-badge">requiredIf</span>
                            <span class="rule-badge">requiredWith</span>
                            <span class="rule-badge">lessThan</span>
                            <span class="rule-badge">greaterThan</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4">
                <a href="demo/" class="btn btn-primary btn-lg">
                    Try All Rules in Demo
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px; vertical-align: -3px;">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p class="mb-1">FormGuardian - Form Validation Library</p>
            <p class="mb-0 opacity-75">
                <a href="demo/">Demo</a> &bull;
                <a href="https://github.com" target="_blank">GitHub</a>
            </p>
        </div>
    </footer>
</body>
</html>
