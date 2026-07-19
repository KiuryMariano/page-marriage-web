<?php
// API para verificar status do pagamento PIX
// Documentação: https://developers.openpix.com.br/api-reference/webhooks/charge

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$txid = $_GET['txid'] ?? '';

if (!$txid) {
    echo json_encode(['error' => 'TXID não informado', 'paid' => false]);
    exit;
}

// Usar correlationID para buscar a cobrança - formato correto: /charge/{correlationID}
$url = "https://api.openpix.com.br/api/v1/charge/$txid";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . OPENPIX_API_KEY,
    'Content-Type: application/json'
]);

curl_setopt($ch, CURLOPT_VERBOSE, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'Erro de conexão: ' . $curlError, 'paid' => false]);
    exit;
}

if ($httpCode >= 400) {
    echo json_encode(['error' => 'Erro na API: HTTP ' . $httpCode, 'paid' => false, 'response' => $response]);
    exit;
}

$result = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Erro ao processar resposta', 'paid' => false]);
    exit;
}

// A resposta pode vir em diferentes formatos
$charge = null;

// Verificar se temos charges (plural - lista) - NOVO FORMATO DA API
if (isset($result['charges']) && is_array($result['charges']) && count($result['charges']) > 0) {
    $charge = $result['charges'][0];
} elseif (isset($result['charge'])) {
    // Formato direto com charge
    $charge = $result['charge'];
} elseif (isset($result[0]) && isset($result[0]['charge'])) {
    // Formato de array
    $charge = $result[0]['charge'];
} elseif (isset($result[0])) {
    // Formato de array direto
    $charge = $result[0];
} else {
    echo json_encode(['error' => 'Charge não encontrada', 'paid' => false]);
    exit;
}

$status = $charge['status'] ?? $charge['state'] ?? 'pending';

// Verificar diferentes formatos de status confirmado
$paid = false;
$statusLower = strtolower($status);

// Status que indicam pagamento confirmado
$confirmedStatuses = ['completed', 'confirmed', 'concluido', 'success', 'paid', 'aprovado'];

if (in_array($statusLower, $confirmedStatuses)) {
    $paid = true;
}

// Verificar também se tem campo 'paid' direto
if (isset($charge['paid']) && $charge['paid'] === true) {
    $paid = true;
}

// Verificar se tem campo 'paidAt' (indica que foi pago)
if (isset($charge['paidAt']) && !empty($charge['paidAt'])) {
    $paid = true;
}

echo json_encode([
    'status' => $status,
    'paid' => $paid,
    'config' => [
        'verification_delay' => PIX_VERIFICATION_DELAY,
        'verification_interval' => PIX_VERIFICATION_INTERVAL
    ]
]);
