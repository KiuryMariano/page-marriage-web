<?php

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function cardPaymentLog($stage, $context = []) {
    $message = '[MercadoPago Card] ' . $stage;

    if (!empty($context)) {
        $message .= ' ' . json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    error_log($message);
}

function createIdempotencyKey() {
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);

    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20);
}

$input = json_decode(file_get_contents('php://input'), true);
$formData = $input['formData'] ?? [];
$items = $input['cart'] ?? [];

if (!is_array($items) || empty($items) || empty($formData['token']) || empty($formData['payment_method_id']) || empty($formData['payer']['email'])) {
    cardPaymentLog('Requisição inválida', ['item_count' => is_array($items) ? count($items) : 0]);
    http_response_code(422);
    echo json_encode(['message' => 'Dados de pagamento incompletos.']);
    exit;
}

$amount = 0;
foreach ($items as $item) {
    $amount += (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 0);
}

if ($amount <= 0) {
    cardPaymentLog('Valor inválido');
    http_response_code(422);
    echo json_encode(['message' => 'O valor do pagamento é inválido.']);
    exit;
}

$externalReference = 'casamento-' . time() . '-' . random_int(1000, 9999);
$paymentData = [
    'transaction_amount' => $amount,
    'token' => $formData['token'],
    'description' => 'Presente de casamento',
    'installments' => (int) ($formData['installments'] ?? 1),
    'payment_method_id' => $formData['payment_method_id'],
    'payer' => [
        'email' => $formData['payer']['email']
    ],
    'external_reference' => $externalReference
];

if (!empty($formData['issuer_id'])) {
    $paymentData['issuer_id'] = (int) $formData['issuer_id'];
}

if (!empty($formData['payer']['identification']['type']) && !empty($formData['payer']['identification']['number'])) {
    $paymentData['payer']['identification'] = [
        'type' => $formData['payer']['identification']['type'],
        'number' => $formData['payer']['identification']['number']
    ];
}

$idempotencyKey = createIdempotencyKey();
cardPaymentLog('Enviando pagamento', [
    'external_reference' => $externalReference,
    'amount' => $amount,
    'installments' => $paymentData['installments'],
    'payment_method_id' => $paymentData['payment_method_id']
]);

$ch = curl_init('https://api.mercadopago.com/v1/payments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . MP_ACCESS_TOKEN,
    'Content-Type: application/json',
    'X-Idempotency-Key: ' . $idempotencyKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    cardPaymentLog('Falha de conexão', ['external_reference' => $externalReference, 'curl_error' => $curlError]);
    http_response_code(502);
    echo json_encode(['message' => 'Não foi possível conectar ao Mercado Pago.']);
    exit;
}

$result = json_decode($response, true);
if (!is_array($result)) {
    cardPaymentLog('Resposta inválida', ['external_reference' => $externalReference, 'http_code' => $httpCode]);
    http_response_code(502);
    echo json_encode(['message' => 'O Mercado Pago retornou uma resposta inválida.']);
    exit;
}

cardPaymentLog('Resposta do pagamento', [
    'external_reference' => $externalReference,
    'http_code' => $httpCode,
    'payment_id' => $result['id'] ?? null,
    'status' => $result['status'] ?? null,
    'status_detail' => $result['status_detail'] ?? null
]);

http_response_code($httpCode >= 200 && $httpCode < 300 ? 200 : $httpCode);
echo json_encode([
    'id' => $result['id'] ?? null,
    'status' => $result['status'] ?? null,
    'status_detail' => $result['status_detail'] ?? null,
    'message' => $result['message'] ?? $result['status_detail'] ?? 'Não foi possível processar o pagamento.'
]);
