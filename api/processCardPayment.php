<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$allowed_origins = ['https://casamentokiuryeleticia.com.br', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

function cardPaymentLog($stage, $context = []) {
    $message = '[MERCADO_PAGO_CARD] ' . $stage;

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

cardPaymentLog('=== INÍCIO DA REQUISIÇÃO ===');
cardPaymentLog('1. Dados recebidos', [
    'has_token' => !empty($formData['token']),
    'token_length' => strlen($formData['token'] ?? ''),
    'has_email' => !empty($formData['payer']['email']),
    'email' => $formData['payer']['email'] ?? 'NÃO INFORMADO',
    'payment_method_id' => $formData['payment_method_id'] ?? null,
    'installments' => $formData['installments'] ?? null,
    'issuer_id' => $formData['issuer_id'] ?? null,
    'identification_type' => $formData['payer']['identification']['type'] ?? null,
    'identification_number' => !empty($formData['payer']['identification']['number'])
        ? '***' . substr($formData['payer']['identification']['number'], -4)
        : 'NÃO INFORMADO',
]);

if (!is_array($items) || empty($items) || empty($formData['token']) || empty($formData['payment_method_id']) || empty($formData['payer']['email'])) {
    cardPaymentLog('❌ VALIDAÇÃO FALHOU - Requisição inválida', [
        'is_array_items' => is_array($items),
        'items_count' => is_array($items) ? count($items) : 'not_array',
        'has_token' => !empty($formData['token']),
        'has_payment_method_id' => !empty($formData['payment_method_id']),
        'has_email' => !empty($formData['payer']['email']),
    ]);
    http_response_code(422);
    echo json_encode(['message' => 'Dados de pagamento incompletos.']);
    exit;
}

cardPaymentLog('2. Validação básica passou');

$amount = 0;
cardPaymentLog('3. Calculando valor total', [
    'items_count' => count($items),
]);

// Validar preços server-side contra fonte canônica: tabela presentes no banco
// (mesma fonte do painel admin e da loja — não pode dessincronizar)
try {
    $database = new Database();
    $rows = $database->fetchAll("SELECT id, preco FROM presentes WHERE ativo = 1");
    $canonicalPrices = [];
    foreach ($rows as $row) {
        $canonicalPrices[(int) $row['id']] = (float) $row['preco'];
    }
} catch (Exception $e) {
    cardPaymentLog('❌ Erro ao carregar preços do banco', ['error' => $e->getMessage()]);
    http_response_code(500);
    echo json_encode(['message' => 'Erro interno. Tente novamente.']);
    exit;
}

foreach ($items as $index => $item) {
    $itemId = (int) ($item['id'] ?? 0);
    $qty = (int) ($item['quantity'] ?? 0);

    if ($itemId <= 0 || $qty <= 0) {
        cardPaymentLog('❌ VALIDAÇÃO FALHOU - Item inválido', [
            'index' => $index,
            'item_id' => $itemId,
            'quantity' => $qty,
        ]);
        http_response_code(422);
        echo json_encode(['message' => 'Item inválido no carrinho.']);
        exit;
    }

    if (!isset($canonicalPrices[$itemId])) {
        cardPaymentLog('❌ VALIDAÇÃO FALHOU - Item desconhecido', ['item_id' => $itemId]);
        http_response_code(422);
        echo json_encode(['message' => 'Item não encontrado.']);
        exit;
    }

    $realPrice = (float) $canonicalPrices[$itemId];
    $clientPrice = (float) ($item['price'] ?? 0);

    // Tolerância de 1 centavo para erro de arredondamento
    if (abs($realPrice - $clientPrice) > 0.01) {
        cardPaymentLog('❌ VALIDAÇÃO FALHOU - Preço adulterado', [
            'item_id' => $itemId,
            'real_price' => $realPrice,
            'client_price' => $clientPrice,
        ]);
        http_response_code(422);
        echo json_encode(['message' => 'Preço do item não confere.']);
        exit;
    }

    $itemTotal = $realPrice * $qty;
    $amount += $itemTotal;
    cardPaymentLog("Item #{$index}", [
        'item_id' => $itemId,
        'title' => $item['title'] ?? 'N/A',
        'unit_price' => $realPrice,
        'quantity' => $qty,
        'subtotal' => $itemTotal,
        'running_total' => $amount,
    ]);
}

if ($amount <= 0) {
    cardPaymentLog('❌ VALIDAÇÃO FALHOU - Valor inválido', ['amount' => $amount]);
    http_response_code(422);
    echo json_encode(['message' => 'O valor do pagamento é inválido.']);
    exit;
}

// Arredondar para 2 casas para evitar flutuação
$amount = round($amount, 2);

cardPaymentLog('4. Valor total calculado', ['amount' => $amount]);

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

// Issuer ID removido - Mercado Pago determina automaticamente
// Enviar issuer_id incorreto causa erro 10102

if (!empty($formData['payer']['identification']['type']) && !empty($formData['payer']['identification']['number'])) {
    $paymentData['payer']['identification'] = [
        'type' => $formData['payer']['identification']['type'],
        'number' => $formData['payer']['identification']['number']
    ];
}

$idempotencyKey = createIdempotencyKey();
cardPaymentLog('5. Preparando envio para Mercado Pago', [
    'external_reference' => $externalReference,
    'idempotency_key' => $idempotencyKey,
    'amount' => $amount,
    'installments' => $paymentData['installments'],
    'payment_method_id' => $paymentData['payment_method_id'],
    'token_length' => strlen($paymentData['token']),
    'payer_email' => $paymentData['payer']['email'],
    'has_identification' => !empty($paymentData['payer']['identification']),
]);

cardPaymentLog('6. Iniciando requisição cURL para Mercado Pago API');

$ch = curl_init('https://api.mercadopago.com/v1/payments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . MP_ACCESS_TOKEN,
    'Content-Type: application/json',
    'X-Idempotency-Key: ' . $idempotencyKey
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

cardPaymentLog('7. Executando cURL', [
    'url' => 'https://api.mercadopago.com/v1/payments',
    'has_access_token' => !empty(MP_ACCESS_TOKEN),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);
curl_close($ch);

if ($curlError) {
    cardPaymentLog('❌ FALHA DE CONEXÃO cURL', [
        'external_reference' => $externalReference,
        'curl_errno' => $curlErrno,
        'curl_error' => $curlError,
    ]);
    http_response_code(502);
    echo json_encode(['message' => 'Não foi possível conectar ao Mercado Pago.']);
    exit;
}

cardPaymentLog('8. Resposta HTTP recebida', [
    'http_code' => $httpCode,
    'response_length' => strlen($response),
]);

$result = json_decode($response, true);
if (!is_array($result)) {
    cardPaymentLog('❌ RESPOSTA INVÁLIDA - JSON não parseado', [
        'external_reference' => $externalReference,
        'http_code' => $httpCode,
        'raw_response' => substr($response, 0, 500),
    ]);
    http_response_code(502);
    echo json_encode(['message' => 'O Mercado Pago retornou uma resposta inválida.']);
    exit;
}

cardPaymentLog('9. Resposta do Mercado Pago processada', [
    'external_reference' => $externalReference,
    'http_code' => $httpCode,
    'payment_id' => $result['id'] ?? null,
    'status' => $result['status'] ?? null,
    'status_detail' => $result['status_detail'] ?? null,
]);

if (isset($result['error']) || $httpCode >= 400) {
    cardPaymentLog('❌ ERRO DO MERCADO PAGO', [
        'http_code' => $httpCode,
        'error_message' => $result['message'] ?? $result['error'] ?? 'Unknown error',
        'error_type' => $result['type'] ?? null,
        'status' => $result['status'] ?? null,
        'status_detail' => $result['status_detail'] ?? null,
        'cause' => $result['cause'] ?? null,
        'full_response' => $result,
    ]);
} elseif ($result['status'] === 'approved') {
    cardPaymentLog('✅ PAGAMENTO APROVADO', [
        'payment_id' => $result['id'],
        'status' => $result['status'],
        'status_detail' => $result['status_detail'],
        'external_reference' => $externalReference,
    ]);
} else {
    cardPaymentLog('⚠️ STATUS DIFERENTE DE APROVADO', [
        'payment_id' => $result['id'],
        'status' => $result['status'],
        'status_detail' => $result['status_detail'],
    ]);
}

cardPaymentLog('=== FIM DA REQUISIÇÃO ===');

// Extrair cause code (para mapeamento de mensagens no frontend) sem vazar resposta completa
$causes = $result['cause'] ?? ($result['debug']['mp_response']['cause'] ?? []);
$causeCode = isset($causes[0]['code']) ? (int) $causes[0]['code'] : null;

http_response_code($httpCode >= 200 && $httpCode < 300 ? 200 : $httpCode);
echo json_encode([
    'id' => $result['id'] ?? null,
    'status' => $result['status'] ?? null,
    'status_detail' => $result['status_detail'] ?? null,
    'cause_code' => $causeCode,
    'message' => $result['message'] ?? $result['status_detail'] ?? 'Não foi possível processar o pagamento.',
    'external_reference' => $externalReference,
]);
