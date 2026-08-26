<?php
/**
 * POST /api/vendas/validate-payment.php
 * Valida o status de um pagamento antes de registrar a venda
 *
 * Este endpoint deve ser chamado APÓS o pagamento ser confirmado
 * para garantir que a venda só é registrada se o pagamento foi aprovado
 */

require_once '../config/database.php';

header('Content-Type: application/json');

// CORS estrito
$allowedOrigins = ['https://casamentokiuryeleticia.com.br', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$metodoPagamento = $input['metodo_pagamento'] ?? null;
$paymentId = $input['payment_id'] ?? null;

if (!$metodoPagamento || !$paymentId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'metodo_pagamento e payment_id são obrigatórios'
    ]);
    exit;
}

try {
    if ($metodoPagamento === 'cartao') {
        // Validar pagamento do cartão com Mercado Pago
        $ch = curl_init('https://api.mercadopago.com/v1/payments/' . $paymentId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . MP_ACCESS_TOKEN
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('Erro ao consultar pagamento');
        }

        $paymentData = json_decode($response, true);
        $status = $paymentData['status'] ?? null;

        if ($status === 'approved') {
            echo json_encode([
                'success' => true,
                'valid' => true,
                'status' => $status,
                'message' => 'Pagamento confirmado'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'valid' => false,
                'status' => $status,
                'message' => 'Pagamento não aprovado'
            ]);
        }
    } elseif ($metodoPagamento === 'pix') {
        // Validar PIX com Woovi
        $ch = curl_init('https://api.woovi.com/api/v1/charge/' . urlencode($paymentId));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: ' . OPENPIX_API_KEY
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('Erro ao consultar PIX');
        }

        $pixData = json_decode($response, true);
        $status = $pixData['status'] ?? null;

        if ($status === 'PAID' || $status === 'COMPLETED') {
            echo json_encode([
                'success' => true,
                'valid' => true,
                'status' => $status,
                'message' => 'PIX confirmado'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'valid' => false,
                'status' => $status,
                'message' => 'PIX não confirmado'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Método de pagamento inválido'
        ]);
    }

} catch (Exception $e) {
    error_log('[VALIDATE_PAYMENT] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao validar pagamento'
    ]);
}
