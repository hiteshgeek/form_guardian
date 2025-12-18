<?php
/**
 * FormGuardian - Generic Remote Validation Endpoint
 * Handles remote validation requests for various fields
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
$rule = $input['rule'] ?? 'validate';

// Simulate processing delay
usleep(300000); // 300ms

$response = [
    'valid' => true,
    'message' => ''
];

// Example validation rules
switch ($rule) {
    case 'username':
        // Reserved usernames
        $reserved = ['admin', 'root', 'system', 'test', 'demo', 'user'];
        if (in_array(strtolower($value), $reserved)) {
            $response['valid'] = false;
            $response['message'] = 'This username is reserved';
        } elseif (strlen($value) < 3) {
            $response['valid'] = false;
            $response['message'] = 'Username must be at least 3 characters';
        }
        break;

    case 'email':
        // Check email format and common disposable domains
        $disposable = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
        $domain = substr(strrchr($value, '@'), 1);

        if (in_array($domain, $disposable)) {
            $response['valid'] = false;
            $response['message'] = 'Disposable email addresses are not allowed';
        }
        break;

    case 'phone':
        // Basic phone validation (simulated)
        if (!preg_match('/^[\d\s\-\+\(\)]+$/', $value)) {
            $response['valid'] = false;
            $response['message'] = 'Invalid phone number format';
        }
        break;

    case 'profanity':
        // Simple profanity filter
        $badWords = ['spam', 'fake', 'test123'];
        foreach ($badWords as $word) {
            if (stripos($value, $word) !== false) {
                $response['valid'] = false;
                $response['message'] = 'Content contains inappropriate words';
                break;
            }
        }
        break;

    default:
        // Generic validation - always pass
        break;
}

echo json_encode($response);
