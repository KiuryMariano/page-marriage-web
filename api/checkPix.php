<?php
require_once 'config.php';

$allowed_origins = ['https://casamentokiuryeleticia.com.br', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

$txid = $_GET['txid'] ?? '';

if (!$txid || !preg_match('/^[a-zA-Z0-9_-]+$/', $txid)) {
    echo json_encode(['error' => 'TXID inválido', 'paid' => false]);
    exit;
}

$url = 'https://api.woovi.com/api/v1/charge/' . urlencode($txid);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . OPENPIX_API_KEY,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError || $httpCode >= 400 || !$response) {
    echo json_encode(['error' => 'Erro ao consultar cobrança', 'paid' => false]);
    exit;
}

$result = json_decode($response, true);

if (!is_array($result)) {
    echo json_encode(['error' => 'Resposta inválida', 'paid' => false]);
    exit;
}

$charge = null;
if (isset($result['charge']) && is_array($result['charge'])) {
    $charge = $result['charge'];
} elseif (isset($result['charges']) && is_array($result['charges']) && count($result['charges']) > 0) {
    $charge = $result['charges'][0];
}

if (!is_array($charge)) {
    echo json_encode(['error' => 'Cobrança não encontrada', 'paid' => false]);
    exit;
}

$status = isset($charge['status']) ? strtolower($charge['status']) : '';
$paid = in_array($status, ['completed', 'confirmed', 'paid', 'concluido', 'aprovado'], true);

if (!$paid && isset($charge['paid']) && $charge['paid'] === true) {
    $paid = true;
}
if (!$paid && !empty($charge['paidAt'])) {
    $paid = true;
}

echo json_encode([
    'status' => $charge['status'] ?? 'unknown',
    'paid' => $paid,
    'config' => [
        'verification_delay' => PIX_VERIFICATION_DELAY,
        'verification_interval' => PIX_VERIFICATION_INTERVAL
    ]
]);
