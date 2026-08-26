<?php
/**
 * GET /api/version.php
 * Diagnóstico de deploy — apenas via CLI, nunca via HTTP
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
header('Content-Type: application/json');
echo json_encode([
    'version' => '2.1',
    'has_debug' => file_exists(__DIR__ . '/processCardPayment.php') && strpos(file_get_contents(__DIR__ . '/processCardPayment.php'), 'debug') !== false,
    'filemtime' => file_exists(__DIR__ . '/processCardPayment.php') ? date('Y-m-d H:i:s', filemtime(__DIR__ . '/processCardPayment.php')) : 'not found'
]);
