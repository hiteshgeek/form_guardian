<?php
/**
 * FormGuardian Demo - Rule Categories Accordion
 * Contains all validation rule categories with their rules and parameters
 */

$ruleCategories = [
    'string' => [
        'label' => 'String Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
        'rules' => [
            'required' => ['label' => 'Required', 'params' => []],
            'minLength' => ['label' => 'Min Length', 'params' => [['name' => 'min', 'type' => 'number', 'label' => 'Minimum', 'default' => 3]]],
            'maxLength' => ['label' => 'Max Length', 'params' => [['name' => 'max', 'type' => 'number', 'label' => 'Maximum', 'default' => 100]]],
            'exactLength' => ['label' => 'Exact Length', 'params' => [['name' => 'length', 'type' => 'number', 'label' => 'Length', 'default' => 10]]],
            'rangeLength' => ['label' => 'Range Length', 'params' => [
                ['name' => 'min', 'type' => 'number', 'label' => 'Min', 'default' => 3],
                ['name' => 'max', 'type' => 'number', 'label' => 'Max', 'default' => 20]
            ]],
            'alpha' => ['label' => 'Letters Only', 'params' => []],
            'alphaNumeric' => ['label' => 'Letters & Numbers', 'params' => []],
            'alphaSpace' => ['label' => 'Letters & Spaces', 'params' => []],
            'alphaDash' => ['label' => 'Alpha-Dash', 'params' => []],
            'noWhitespace' => ['label' => 'No Whitespace', 'params' => []],
            'lowercase' => ['label' => 'Lowercase', 'params' => []],
            'uppercase' => ['label' => 'Uppercase', 'params' => []],
            'contains' => ['label' => 'Contains', 'params' => [['name' => 'substring', 'type' => 'text', 'label' => 'Substring', 'default' => '']]],
            'notContains' => ['label' => 'Not Contains', 'params' => [['name' => 'substring', 'type' => 'text', 'label' => 'Substring', 'default' => '']]],
            'startsWith' => ['label' => 'Starts With', 'params' => [['name' => 'prefix', 'type' => 'text', 'label' => 'Prefix', 'default' => '']]],
            'endsWith' => ['label' => 'Ends With', 'params' => [['name' => 'suffix', 'type' => 'text', 'label' => 'Suffix', 'default' => '']]],
            'wordCount' => ['label' => 'Word Count', 'params' => [
                ['name' => 'min', 'type' => 'number', 'label' => 'Min Words', 'default' => 1],
                ['name' => 'max', 'type' => 'number', 'label' => 'Max Words', 'default' => 100]
            ]]
        ]
    ],
    'pattern' => [
        'label' => 'Pattern Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'rules' => [
            'email' => ['label' => 'Email', 'params' => []],
            'url' => ['label' => 'URL', 'params' => []],
            'phone' => ['label' => 'Phone', 'params' => [['name' => 'format', 'type' => 'select', 'label' => 'Format', 'options' => ['any' => 'Any', 'us' => 'US', 'international' => 'International'], 'default' => 'any']]],
            'postalCode' => ['label' => 'Postal Code', 'params' => [['name' => 'country', 'type' => 'select', 'label' => 'Country', 'options' => ['any' => 'Any', 'us' => 'US', 'ca' => 'Canada', 'uk' => 'UK'], 'default' => 'any']]],
            'ipAddress' => ['label' => 'IP Address', 'params' => [['name' => 'version', 'type' => 'select', 'label' => 'Version', 'options' => ['any' => 'Any', 'v4' => 'IPv4', 'v6' => 'IPv6'], 'default' => 'any']]],
            'hexColor' => ['label' => 'Hex Color', 'params' => []],
            'slug' => ['label' => 'URL Slug', 'params' => []],
            'username' => ['label' => 'Username', 'params' => [
                ['name' => 'minLength', 'type' => 'number', 'label' => 'Min Length', 'default' => 3],
                ['name' => 'maxLength', 'type' => 'number', 'label' => 'Max Length', 'default' => 20]
            ]],
            'creditCard' => ['label' => 'Credit Card', 'params' => []],
            'uuid' => ['label' => 'UUID', 'params' => []],
            'password' => ['label' => 'Password', 'params' => [
                ['name' => 'minLength', 'type' => 'number', 'label' => 'Min Length', 'default' => 8],
                ['name' => 'requireUppercase', 'type' => 'checkbox', 'label' => 'Require Uppercase', 'default' => true],
                ['name' => 'requireLowercase', 'type' => 'checkbox', 'label' => 'Require Lowercase', 'default' => true],
                ['name' => 'requireNumber', 'type' => 'checkbox', 'label' => 'Require Number', 'default' => true],
                ['name' => 'requireSpecial', 'type' => 'checkbox', 'label' => 'Require Special', 'default' => false]
            ]],
            'regex' => ['label' => 'Custom Regex', 'params' => [['name' => 'pattern', 'type' => 'text', 'label' => 'Pattern', 'default' => '']]]
        ]
    ],
    'number' => [
        'label' => 'Number Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
        'rules' => [
            'numeric' => ['label' => 'Numeric', 'params' => []],
            'integer' => ['label' => 'Integer', 'params' => []],
            'float' => ['label' => 'Float', 'params' => []],
            'positive' => ['label' => 'Positive', 'params' => []],
            'negative' => ['label' => 'Negative', 'params' => []],
            'min' => ['label' => 'Min Value', 'params' => [['name' => 'min', 'type' => 'number', 'label' => 'Minimum', 'default' => 0]]],
            'max' => ['label' => 'Max Value', 'params' => [['name' => 'max', 'type' => 'number', 'label' => 'Maximum', 'default' => 100]]],
            'range' => ['label' => 'Range', 'params' => [
                ['name' => 'min', 'type' => 'number', 'label' => 'Min', 'default' => 0],
                ['name' => 'max', 'type' => 'number', 'label' => 'Max', 'default' => 100]
            ]],
            'divisibleBy' => ['label' => 'Divisible By', 'params' => [['name' => 'divisor', 'type' => 'number', 'label' => 'Divisor', 'default' => 2]]],
            'even' => ['label' => 'Even', 'params' => []],
            'odd' => ['label' => 'Odd', 'params' => []],
            'decimal' => ['label' => 'Decimal Places', 'params' => [['name' => 'places', 'type' => 'number', 'label' => 'Max Places', 'default' => 2]]],
            'percentage' => ['label' => 'Percentage (0-100)', 'params' => []]
        ]
    ],
    'date' => [
        'label' => 'Date Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'rules' => [
            'date' => ['label' => 'Valid Date', 'params' => []],
            'dateAfter' => ['label' => 'Date After', 'params' => [['name' => 'date', 'type' => 'date', 'label' => 'After Date', 'default' => '']]],
            'dateBefore' => ['label' => 'Date Before', 'params' => [['name' => 'date', 'type' => 'date', 'label' => 'Before Date', 'default' => '']]],
            'dateBetween' => ['label' => 'Date Between', 'params' => [
                ['name' => 'startDate', 'type' => 'date', 'label' => 'Start Date', 'default' => ''],
                ['name' => 'endDate', 'type' => 'date', 'label' => 'End Date', 'default' => '']
            ]],
            'age' => ['label' => 'Minimum Age', 'params' => [['name' => 'minAge', 'type' => 'number', 'label' => 'Min Age', 'default' => 18]]],
            'futureDate' => ['label' => 'Future Date', 'params' => []],
            'pastDate' => ['label' => 'Past Date', 'params' => []],
            'weekday' => ['label' => 'Weekday Only', 'params' => []],
            'weekend' => ['label' => 'Weekend Only', 'params' => []]
        ]
    ],
    'file' => [
        'label' => 'File Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        'rules' => [
            'fileRequired' => ['label' => 'File Required', 'params' => []],
            'fileSize' => ['label' => 'Max File Size', 'params' => [['name' => 'maxSize', 'type' => 'number', 'label' => 'Max Size (KB)', 'default' => 5120]]],
            'fileMinSize' => ['label' => 'Min File Size', 'params' => [['name' => 'minSize', 'type' => 'number', 'label' => 'Min Size (KB)', 'default' => 1]]],
            'fileType' => ['label' => 'File Type', 'params' => [['name' => 'types', 'type' => 'text', 'label' => 'MIME Types (comma separated)', 'default' => 'image/jpeg,image/png']]],
            'fileExtension' => ['label' => 'File Extension', 'params' => [['name' => 'extensions', 'type' => 'text', 'label' => 'Extensions (comma separated)', 'default' => 'jpg,png,gif']]],
            'imageOnly' => ['label' => 'Images Only', 'params' => []],
            'maxFiles' => ['label' => 'Max Files', 'params' => [['name' => 'max', 'type' => 'number', 'label' => 'Maximum', 'default' => 5]]],
            'minFiles' => ['label' => 'Min Files', 'params' => [['name' => 'min', 'type' => 'number', 'label' => 'Minimum', 'default' => 1]]]
        ]
    ],
    'comparison' => [
        'label' => 'Comparison Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
        'rules' => [
            'equals' => ['label' => 'Equals Value', 'params' => [['name' => 'value', 'type' => 'text', 'label' => 'Value', 'default' => '']]],
            'notEquals' => ['label' => 'Not Equals', 'params' => [['name' => 'value', 'type' => 'text', 'label' => 'Value', 'default' => '']]],
            'confirmedBy' => ['label' => 'Confirmed By Field', 'params' => [['name' => 'field', 'type' => 'field', 'label' => 'Confirmation Field', 'default' => '']]],
            'lessThan' => ['label' => 'Less Than', 'params' => [['name' => 'value', 'type' => 'number', 'label' => 'Value', 'default' => 100]]],
            'greaterThan' => ['label' => 'Greater Than', 'params' => [['name' => 'value', 'type' => 'number', 'label' => 'Value', 'default' => 0]]],
            'requiredIf' => ['label' => 'Required If', 'params' => [
                ['name' => 'field', 'type' => 'field', 'label' => 'Condition Field', 'default' => ''],
                ['name' => 'value', 'type' => 'text', 'label' => 'Has Value', 'default' => '']
            ]],
            'requiredWith' => ['label' => 'Required With', 'params' => [['name' => 'field', 'type' => 'field', 'label' => 'Other Field', 'default' => '']]],
            'requiredWithout' => ['label' => 'Required Without', 'params' => [['name' => 'field', 'type' => 'field', 'label' => 'Other Field', 'default' => '']]]
        ]
    ],
    'selection' => [
        'label' => 'Selection Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
        'rules' => [
            'inList' => ['label' => 'In List', 'params' => [['name' => 'values', 'type' => 'text', 'label' => 'Values (comma separated)', 'default' => '']]],
            'notInList' => ['label' => 'Not In List', 'params' => [['name' => 'values', 'type' => 'text', 'label' => 'Values (comma separated)', 'default' => '']]],
            'minSelected' => ['label' => 'Min Selected', 'params' => [['name' => 'min', 'type' => 'number', 'label' => 'Minimum', 'default' => 1]]],
            'maxSelected' => ['label' => 'Max Selected', 'params' => [['name' => 'max', 'type' => 'number', 'label' => 'Maximum', 'default' => 3]]],
            'exactSelected' => ['label' => 'Exact Selected', 'params' => [['name' => 'count', 'type' => 'number', 'label' => 'Count', 'default' => 2]]]
        ]
    ],
    'async' => [
        'label' => 'Async Rules',
        'icon' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
        'rules' => [
            'remote' => ['label' => 'Remote Validation', 'params' => [
                ['name' => 'url', 'type' => 'text', 'label' => 'URL', 'default' => 'api/validate.php'],
                ['name' => 'method', 'type' => 'select', 'label' => 'Method', 'options' => ['GET' => 'GET', 'POST' => 'POST'], 'default' => 'POST']
            ]],
            'unique' => ['label' => 'Unique (Server Check)', 'params' => [
                ['name' => 'url', 'type' => 'text', 'label' => 'URL', 'default' => 'api/check-unique.php'],
                ['name' => 'field', 'type' => 'text', 'label' => 'Field Name', 'default' => '']
            ]],
            'exists' => ['label' => 'Exists (Server Check)', 'params' => [
                ['name' => 'url', 'type' => 'text', 'label' => 'URL', 'default' => 'api/check-exists.php'],
                ['name' => 'field', 'type' => 'text', 'label' => 'Field Name', 'default' => '']
            ]]
        ]
    ]
];
?>

<?php foreach ($ruleCategories as $categoryId => $category): ?>
<div class="fg-accordion-item" data-category="<?= $categoryId ?>">
    <button type="button" class="fg-accordion-header" aria-expanded="false">
        <span class="fg-accordion-icon"><?= $category['icon'] ?></span>
        <span class="fg-accordion-title"><?= $category['label'] ?></span>
        <svg class="fg-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
        </svg>
    </button>
    <div class="fg-accordion-body">
        <div class="fg-rules-grid">
            <?php foreach ($category['rules'] as $ruleId => $rule): ?>
            <div class="fg-rule-card" data-rule="<?= $ruleId ?>" data-category="<?= $categoryId ?>">
                <div class="fg-rule-header">
                    <span class="fg-rule-name"><?= $rule['label'] ?></span>
                    <button type="button" class="fg-rule-add-btn" title="Add rule">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                </div>
                <?php if (!empty($rule['params'])): ?>
                <div class="fg-rule-params">
                    <?php foreach ($rule['params'] as $param): ?>
                    <div class="fg-rule-param">
                        <label class="fg-param-label"><?= $param['label'] ?></label>
                        <?php if ($param['type'] === 'select'): ?>
                        <select class="fg-param-input" data-param="<?= $param['name'] ?>">
                            <?php foreach ($param['options'] as $optValue => $optLabel): ?>
                            <option value="<?= $optValue ?>" <?= $param['default'] === $optValue ? 'selected' : '' ?>><?= $optLabel ?></option>
                            <?php endforeach; ?>
                        </select>
                        <?php elseif ($param['type'] === 'checkbox'): ?>
                        <input type="checkbox" class="fg-param-checkbox" data-param="<?= $param['name'] ?>" <?= $param['default'] ? 'checked' : '' ?>>
                        <?php elseif ($param['type'] === 'field'): ?>
                        <select class="fg-param-input fg-field-param" data-param="<?= $param['name'] ?>">
                            <option value="">-- Select field --</option>
                        </select>
                        <?php else: ?>
                        <input type="<?= $param['type'] ?>" class="fg-param-input" data-param="<?= $param['name'] ?>" value="<?= htmlspecialchars($param['default']) ?>">
                        <?php endif; ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php endforeach; ?>
