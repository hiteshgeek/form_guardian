# FormGuardian

A powerful, lightweight vanilla JavaScript form validation library with Bootstrap 3, 4, and 5 support. No dependencies required.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-3%20%7C%204%20%7C%205-purple)](https://getbootstrap.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow)](http://vanilla-js.com/)

## Features

- **Zero Dependencies** - Pure vanilla JavaScript, no jQuery required
- **Bootstrap Support** - Works with Bootstrap 3, 4, and 5 with automatic version detection
- **50+ Validation Rules** - Comprehensive rule set for strings, patterns, numbers, dates, files, and more
- **Floating Error Container** - Collapsible error panel with bidirectional field highlighting
- **Label Tooltips** - Show validation rules on field labels
- **Live Validation** - Real-time validation with debouncing
- **Data Attributes** - Initialize validation from HTML data attributes (perfect for PHP/server-side)
- **Light & Dark Themes** - Built-in theme support with CSS custom properties
- **Async Validation** - Support for remote/AJAX validation rules
- **Custom Messages** - Fully customizable error messages
- **Chainable API** - Fluent interface for easy configuration

## Installation

### Manual Download

Download the latest release and include the files in your project:

```html
<!-- CSS -->
<link rel="stylesheet" href="dist/css/form-guardian.css">

<!-- JavaScript (ES Module) -->
<script type="module" src="dist/js/form-guardian.esm.js"></script>

<!-- OR JavaScript (IIFE for older browsers) -->
<script src="dist/js/form-guardian.iife.js"></script>
```

### Build from Source

```bash
# Clone the repository
git clone https://github.com/hiteshgeek/form_guardian.git

# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run prod
```

## Quick Start

### JavaScript API

```javascript
// Initialize FormGuardian
const validator = new FormGuardian('#myForm', {
    bootstrapVersion: 5,
    showErrorContainer: true,
    showLabelTooltips: true
});

// Add validation rules
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
});

// Chain multiple fields
validator
    .addField('#firstName', { required: true, alpha: true })
    .addField('#lastName', { required: true, alpha: true })
    .addField('#age', { required: true, integer: true, min: 18 });
```

### HTML Data Attributes

```html
<form id="myForm" data-formguardian data-fg-bootstrap="5" data-fg-error-container="true">
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email"
               class="form-control"
               id="email"
               data-fg-rules='{"required": true, "email": true}'
               data-fg-messages='{"required": "Email is required"}'>
    </div>

    <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password"
               class="form-control"
               id="password"
               data-fg-rules='{"required": true, "minLength": 8, "password": {"requireUppercase": true}}'>
    </div>

    <button type="submit" class="btn btn-primary">Submit</button>
</form>

<script>
    // Auto-initialize all forms with data-formguardian attribute
    FormGuardian.autoInit();
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bootstrapVersion` | number\|string | `'auto'` | Bootstrap version: 3, 4, 5, or 'auto' |
| `validateOn` | array | `['blur', 'submit']` | Events that trigger validation |
| `liveValidation` | boolean | `true` | Validate on input with debounce |
| `debounceMs` | number | `300` | Debounce delay in milliseconds |
| `showErrorContainer` | boolean | `true` | Show floating error container |
| `errorContainerPosition` | string | `'left-bottom'` | Position: 'left-bottom', 'right-bottom', 'left-top', 'right-top' |
| `errorContainerHeight` | number | `200` | Max height of error container |
| `showLabelTooltips` | boolean | `false` | Show validation rules on labels |
| `scrollToError` | boolean | `true` | Scroll to first error on submit |
| `focusOnError` | boolean | `true` | Focus first error field |
| `stopOnFirstError` | boolean | `false` | Stop on first error |

## Validation Rules

### String Rules
- `required` - Field must have a value
- `minLength` - Minimum character count
- `maxLength` - Maximum character count
- `exactLength` - Exact character count
- `rangeLength` - Between min and max characters
- `alpha` - Letters only (a-zA-Z)
- `alphaNumeric` - Letters and numbers
- `alphaSpace` - Letters and spaces
- `alphaDash` - Letters, numbers, dashes, underscores
- `noWhitespace` - No whitespace allowed
- `contains` - Must contain substring
- `startsWith` - Must start with string
- `endsWith` - Must end with string

### Pattern Rules
- `email` - Valid email format
- `url` - Valid URL format
- `phone` - Phone number format
- `creditCard` - Credit card (Luhn check)
- `uuid` - UUID format
- `hexColor` - Hex color code
- `ipAddress` - IPv4/IPv6 address
- `password` - Password complexity (configurable)
- `regex` - Custom regex pattern

### Number Rules
- `numeric` - Must be a number
- `integer` - Must be an integer
- `float` - Must be a decimal
- `positive` - Must be positive
- `negative` - Must be negative
- `min` - Minimum value
- `max` - Maximum value
- `range` - Between min and max
- `divisibleBy` - Divisible by number

### Date Rules
- `date` - Valid date
- `dateAfter` - After specified date
- `dateBefore` - Before specified date
- `dateBetween` - Between dates
- `age` - Minimum age
- `futureDate` - Must be in future
- `pastDate` - Must be in past

### File Rules
- `fileRequired` - File must be selected
- `fileSize` - Max file size
- `fileMinSize` - Min file size
- `fileType` - Allowed MIME types
- `fileExtension` - Allowed extensions
- `imageOnly` - Images only
- `maxFiles` - Maximum file count

### Comparison Rules
- `equals` - Must equal value
- `notEquals` - Must not equal value
- `confirmedBy` - Must match another field
- `requiredIf` - Required if condition
- `requiredWith` - Required with other field

## API Methods

### Field Management

```javascript
// Add field with rules
validator.addField('#email', { required: true, email: true });

// Add field with custom messages
validator.addField('#email', { required: true }, { required: 'Email is required' });

// Add rule to existing field
validator.addRule('#password', 'minLength', { min: 12 });

// Remove rule from field
validator.removeRule('#password', 'minLength');

// Remove field entirely
validator.removeField('#optionalField');

// Get field configuration
const config = validator.getField('#email');
```

### Validation

```javascript
// Validate entire form
const isValid = await validator.validate();

// Validate single field
const isFieldValid = await validator.validateField('#email');

// Check if form is valid (sync)
if (validator.isValid()) {
    // Form is valid
}

// Get all current errors
const errors = validator.getErrors();

// Clear all errors
validator.clearErrors();
```

### Events

```javascript
const form = document.getElementById('myForm');

// Form validated
form.addEventListener('fg:validated', (e) => {
    console.log('Valid:', e.detail.isValid);
    console.log('Errors:', e.detail.errors);
});

// Field validated
form.addEventListener('fg:field:validated', (e) => {
    console.log('Field:', e.detail.field);
    console.log('Valid:', e.detail.isValid);
});

// Form submit (when valid)
form.addEventListener('fg:submit', (e) => {
    console.log('Form ready to submit');
});
```

### Static Methods

```javascript
// Get instance for form
const instance = FormGuardian.getInstance('#myForm');

// Initialize from data attributes
const validator = FormGuardian.initFromDataAttributes('#myForm');

// Auto-init all forms
const validators = FormGuardian.autoInit();

// Get all available rules
const rules = FormGuardian.getRules();
```

## Custom Messages

```javascript
// Per-field messages
validator.addField('#email', {
    required: true,
    email: true,
    maxLength: 100
}, {
    required: 'Email address is required',
    email: 'Please enter a valid email',
    maxLength: 'Email must be under {max} characters'
});
```

## PHP Integration

```php
<?php
$rules = [
    'email' => ['required' => true, 'email' => true],
    'password' => ['required' => true, 'minLength' => 8]
];
?>

<form data-formguardian data-fg-bootstrap="5">
    <input type="email"
           id="email"
           data-fg-rules='<?= htmlspecialchars(json_encode($rules['email'])) ?>'>

    <input type="password"
           id="password"
           data-fg-rules='<?= htmlspecialchars(json_encode($rules['password'])) ?>'>

    <button type="submit">Submit</button>
</form>
```

## Theming

FormGuardian supports light and dark themes through CSS custom properties:

```css
/* Custom theme overrides */
:root {
    --fg-color-primary: #0d6efd;
    --fg-color-success: #198754;
    --fg-color-error: #dc3545;
    --fg-bg-primary: #ffffff;
    --fg-text-primary: #212529;
}

[data-theme="dark"] {
    --fg-bg-primary: #1a1a2e;
    --fg-text-primary: #eaeaea;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with IIFE build)

## Project Structure

```
form_guardian/
├── src/
│   ├── library/           # Core library source
│   │   ├── js/
│   │   │   ├── core/      # FormGuardian core classes
│   │   │   ├── rules/     # Validation rules
│   │   │   ├── adapters/  # Bootstrap adapters
│   │   │   ├── components/# UI components
│   │   │   └── utils/     # Utility functions
│   │   └── scss/          # Library styles
│   └── assets/            # Demo application source
├── dist/                  # Built files
├── demo/                  # Demo application
├── setup/                 # Setup documentation
└── includes/              # PHP includes
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Live Demo](https://hiteshgeek.github.io/form_guardian/demo/)
- [Setup Guide](https://hiteshgeek.github.io/form_guardian/setup/)
- [GitHub Repository](https://github.com/hiteshgeek/form_guardian)

## Author

**Hitesh Geek** - [@hiteshgeek](https://github.com/hiteshgeek)
