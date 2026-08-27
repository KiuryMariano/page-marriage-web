<?php
// API para criar cobrança PIX com Woovi (antiga OpenPix)
// Documentação: https://developers.woovi.com/api-redoc

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

// CORS estrito: apenas domínios permitidos
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

// Ler dados recebidos
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$descricao = isset($input['descricao']) ? substr(trim((string) $input['descricao']), 0, 200) : 'Presente Casamento';
$nome = isset($input['nome']) ? substr(trim((string) $input['nome']), 0, 100) : 'Convidado';
$cart = $input['cart'] ?? [];

// Source of truth de preços: tabela presentes no banco
// (mesma fonte do painel admin e da loja — não pode dessincronizar)
try {
    $database = new Database();
    $rows = $database->fetchAll("SELECT id, preco FROM presentes WHERE ativo = 1");
    $canonicalPrices = [];
    foreach ($rows as $row) {
        $canonicalPrices[(int) $row['id']] = (float) $row['preco'];
    }
} catch (Exception $e) {
    error_log('[CREATE_PIX] Erro ao carregar preços do banco: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno. Tente novamente.']);
    exit;
}

// Calcular valor server-side a partir do carrinho (anti-adulteração)
$amountReais = 0.0;
if (is_array($cart) && count($cart) > 0) {
    foreach ($cart as $item) {
        $itemId = (int) ($item['id'] ?? 0);
        $qty = (int) ($item['quantity'] ?? 0);

        if ($itemId <= 0 || $qty <= 0 || !isset($canonicalPrices[$itemId])) {
            http_response_code(422);
            echo json_encode(['error' => 'Carrinho inválido.']);
            exit;
        }

        $clientPrice = (float) ($item['price'] ?? 0);
        $realPrice = (float) $canonicalPrices[$itemId];

        if (abs($realPrice - $clientPrice) > 0.01) {
            http_response_code(422);
            echo json_encode(['error' => 'Preço do item não confere.']);
            exit;
        }

        $amountReais += $realPrice * $qty;
    }
} else {
    // Fallback: se não enviar cart, usa valor informado (mas em centavos, mantém compat)
    $valorCentavosFallback = isset($input['valor']) ? (int) $input['valor'] : 0;
    if ($valorCentavosFallback <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Valor inválido.']);
        exit;
    }
    $amountReais = $valorCentavosFallback / 100;
}

$amountReais = round($amountReais, 2);
$valorCentavos = (int) round($amountReais * 100);

if ($valorCentavos <= 0) {
    http_response_code(422);
    echo json_encode(['error' => 'Valor inválido.']);
    exit;
}

// Criar cobrança PIX
$correlationID = 'casamento-' . time() . '-' . random_int(1000, 9999);

// Payload da API Woovi
$data = [
    'correlationID' => $correlationID,
    'value' => $valorCentavos,
    'comment' => $descricao,
    'additionalInfo' => [
        [
            'key' => 'descricao',
            'value' => "Presente de $nome"
        ]
    ],
];

$ch = curl_init('https://api.woovi.com/api/v1/charge');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . WOOVI_APP_ID,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    error_log('[CREATE_PIX] curl error: ' . $curlError);
    echo json_encode(['error' => 'Erro de conexão com a Woovi.']);
    exit;
}

if ($httpCode >= 400) {
    error_log('[CREATE_PIX] woovi http error: ' . $httpCode . ' body: ' . substr($response, 0, 500));
    echo json_encode(['error' => 'Não foi possível gerar o PIX agora. Tente novamente.']);
    exit;
}

$result = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('[CREATE_PIX] json decode error: ' . substr($response, 0, 200));
    echo json_encode(['error' => 'Resposta inválida da Woovi.']);
    exit;
}

$brCode = $result['brCode'] ?? ($result['charge']['brCode'] ?? '');

if (!$brCode) {
    error_log('[CREATE_PIX] brCode ausente. response keys: ' . implode(',', array_keys($result)));
    echo json_encode(['error' => 'Não foi possível gerar o QR Code.']);
    exit;
}

echo json_encode([
    'qrCodeImage' => $brCode,
    'brCode' => $brCode,
    'txid' => $correlationID
]);
