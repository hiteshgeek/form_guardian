<?php
/**
 * FormGuardian - Existence Check Endpoint
 * Checks if a value exists in database (simulated)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get input
$input = $_SERVER['REQUEST_METHOD'] === 'POST'
    ? json_decode(file_get_contents('php://input'), true) ?? $_POST
    : $_GET;

$field = $input['field'] ?? '';
$value = $input['value'] ?? '';

// Simulate processing delay
usleep(350000); // 350ms

$response = [
    'valid' => true,
    'message' => ''
];

// Simulated "valid" values that exist
$validValues = [
    'product_code' => [
        'PROD001',
        'PROD002',
        'PROD003',
        'SKU-123',
        'SKU-456'
    ],
    'coupon_code' => [
        'SAVE10',
        'SAVE20',
        'FREESHIP',
        'WELCOME'
    ],
    'employee_id' => [
        'EMP001',
        'EMP002',
        'EMP003'
    ]
];

// Check if value exists
$fieldValues = $validValues[$field] ?? [];

if (!empty($value) && !in_array(strtoupper($value), array_map('strtoupper', $fieldValues))) {
    $response['valid'] = false;
    $response['message'] = ucfirst(str_replace('_', ' ', $field)) . ' not found';
}

echo json_encode($response);
