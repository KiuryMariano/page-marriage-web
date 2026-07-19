<?php
// API para criar preferência de pagamento Mercado Pago
// Suba este arquivo para: seu-site.com/api/createPreference.php

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Ler dados recebidos
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$itens = $input['itens'] ?? [];
$nome = $input['nome'] ?? 'Convidado';

if (empty($itens)) {
    echo json_encode(['error' => 'Nenhum item informado']);
    exit;
}

// Calcular total
$total = 0;
foreach ($itens as $item) {
    $total += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
}

// Criar preferência de pagamento
$externalReference = 'casamento-' . time() . '-' . rand(1000, 9999);

$preferenceData = [
    'items' => [],
    'back_urls' => [
        'success' => SITE_URL . '/pagamento-sucesso',
        'failure' => SITE_URL . '/pagamento-falha',
        'pending' => SITE_URL . '/pagamento-pendente'
    ],
    'auto_return' => 'approved',
    'external_reference' => $externalReference,
    'payer' => [
        'name' => $nome,
        'email' => $_POST['email'] ?? ''
    ]
];

// Adicionar itens
foreach ($itens as $item) {
    $preferenceData['items'][] = [
        'id' => $item['id'],
        'title' => $item['title'],
        'quantity' => $item['quantity'],
        'currency_id' => 'BRL',
        'unit_price' => $item['price']
    ];
}

$ch = curl_init('https://api.mercadopago.com/checkout/preferences');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preferenceData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . MP_ACCESS_TOKEN,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'Erro de conexão: ' . $curlError]);
    exit;
}

if ($httpCode >= 400) {
    echo json_encode(['error' => 'Erro ao criar preferência: HTTP ' . $httpCode]);
    exit;
}

$result = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Erro ao processar resposta da API']);
    exit;
}

$initPoint = $result['init_point'] ?? '';
$preferenceId = $result['id'] ?? '';

// Retornar init_point para redirecionar
echo json_encode([
    'init_point' => $initPoint,
    'preference_id' => $preferenceId
]);
