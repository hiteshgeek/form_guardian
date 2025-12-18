<?php
/**
 * FormGuardian - Uniqueness Check Endpoint
 * Checks if a value is unique (simulated database check)
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
usleep(400000); // 400ms

$response = [
    'valid' => true,
    'message' => ''
];

// Simulated "existing" values in database
$existingValues = [
    'email' => [
        'john@example.com',
        'jane@example.com',
        'admin@example.com',
        'test@test.com'
    ],
    'username' => [
        'john_doe',
        'jane_doe',
        'admin',
        'moderator',
        'testuser'
    ],
    'phone' => [
        '+1234567890',
        '+0987654321'
    ]
];

// Check if value exists
$fieldValues = $existingValues[$field] ?? [];

if (in_array(strtolower($value), array_map('strtolower', $fieldValues))) {
    $response['valid'] = false;
    $response['message'] = ucfirst($field) . ' is already taken';
}

echo json_encode($response);
