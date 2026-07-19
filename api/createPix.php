<?php
// API para criar cobrança PIX com OpenPix
// Documentação: https://developers.openpix.com.br/api-reference/webhooks/charge

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Ler dados recebidos
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$valor = $input['valor'] ?? 0;
$descricao = $input['descricao'] ?? 'Presente Casamento';
$nome = $input['nome'] ?? 'Convidado';

if (!$valor) {
    echo json_encode(['error' => 'Valor não informado']);
    exit;
}

// Converter valor de centavos para reais se necessário
$valorEmReais = $valor > 10000 ? $valor / 100 : $valor;

// Criar cobrança PIX
$correlationID = 'casamento-' . time() . '-' . rand(1000, 9999);

// Payload correto da API OpenPix (endpoint /charge)
$data = [
    'correlationID' => $correlationID,
    'value' => $valorEmReais,
    'comment' => $descricao,
    'additionalInfo' => [
        [
            'key' => 'descricao',
            'value' => "Presente de $nome"
        ]
    ],
    'payload' => [
        'title' => $descricao,
        'description' => "Presente de $nome"
    ]
];

$ch = curl_init('https://api.openpix.com.br/api/v1/charge');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . OPENPIX_API_KEY,
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
    echo json_encode(['error' => 'Erro ao criar PIX: HTTP ' . $httpCode . ' - ' . substr($response, 0, 200)]);
    exit;
}

$result = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Erro ao processar resposta da API']);
    exit;
}

// Verificar se temos o brCode na resposta
$brCode = $result['brCode'] ?? ($result['charge']['brCode'] ?? '');

if (!$brCode) {
    echo json_encode(['error' => 'brCode não encontrado na resposta da API']);
    exit;
}

// Retornar dados para o frontend
echo json_encode([
    'qrCodeImage' => $brCode,
    'brCode' => $brCode,
    'txid' => $correlationID
]);
