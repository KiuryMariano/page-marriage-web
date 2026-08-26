<?php
/**
 * POST /api/vendas/webhook.php
 * Webhook para receber notificações de pagamento do Mercado Pago e Woovi
 *
 * Mercado Pago: Envia notificações quando o status do pagamento muda
 * Woovi: Envia notificações via webhook configurado no painel
 */

require_once '../config/database.php';

// Logging de webhooks para debug
error_log('[WEBHOOK] Requisição recebida: ' . $_SERVER['REQUEST_METHOD']);
error_log('[WEBHOOK] Headers: ' . json_encode(getallheaders()));
error_log('[WEBHOOK] Body: ' . file_get_contents('php://input'));

// CORS para webhooks (origens desconhecidas)
header('Content-Type: application/json');

// Webhooks não usam CORS normal - são chamados diretamente pelas APIs
// Mas precisamos aceitar a requisição
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Obter dados do webhook
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Detectar qual API está enviando
$mercadoPagoTopic = $_GET['topic'] ?? $data['topic'] ?? null;
$wooviCharge = $data['charge'] ?? null;

try {
    $database = new Database();
    $pdo = $database->getConnection();
    $pdo->beginTransaction();

    // Mercado Pago Webhook
    if ($mercadoPagoTopic === 'payment' || isset($data['data']['id'])) {
        $paymentId = $data['data']['id'] ?? null;

        if (!$paymentId) {
            throw new Exception('ID do pagamento não fornecido');
        }

        error_log('[WEBHOOK_MP] Pagamento ID: ' . $paymentId);

        // Consultar status na API do Mercado Pago
        $ch = curl_init('https://api.mercadopago.com/v1/payments/' . $paymentId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . MP_ACCESS_TOKEN
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('Erro ao consultar pagamento no Mercado Pago');
        }

        $paymentData = json_decode($response, true);
        $status = $paymentData['status'] ?? null;
        $externalRef = $paymentData['external_reference'] ?? null;

        error_log('[WEBHOOK_MP] Status: ' . $status . ', Ref: ' . $externalRef);

        // Se aprovado, registrar a venda
        if ($status === 'approved') {
            // Extrair itens do external_reference se estiver no formato esperado
            // Ou buscar de uma tabela de intenção de pagamento

            // IMPLEMENTAÇÃO: Buscar intenção de pagamento pendente
            // $intent = buscarIntensaoPagamento($externalRef);

            // Por enquanto, vamos usar um formato simples de external_reference
            // que contém os itens em formato codificado

            error_log('[WEBHOOK_MP] Pagamento aprovado, registrando venda');
            // registrarVenda($itens, 'cartao');
        }

        $pdo->commit();
        echo json_encode(['success' => true]);
        exit;
    }

    // Woovi Webhook
    if (isset($wooviCharge['correlationID'])) {
        $txid = $wooviCharge['correlationID'];
        $status = $wooviCharge['status'] ?? null;

        error_log('[WEBHOOK_WOOVIX] TXID: ' . $txid . ', Status: ' . $status);

        // Se pago, registrar a venda
        if ($status === 'PAID' || $status === 'COMPLETED') {
            error_log('[WEBHOOK_WOOVIX] PIX pago, registrando venda');
            // IMPLEMENTAÇÃO: Buscar intenção de pagamento e registrar venda
        }

        $pdo->commit();
        echo json_encode(['success' => true]);
        exit;
    }

    // Webhook não reconhecido
    error_log('[WEBHOOK] Tipo de webhook não reconhecido');
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de webhook não reconhecido']);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('[WEBHOOK_ERROR] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao processar webhook']);
}
