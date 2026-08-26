<?php
/**
 * POST /api/vendas/create.php
 * Registra uma venda de presentes (cotas)
 * Diminui cotas disponíveis automaticamente via trigger
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar dados
    if (empty($data['itens']) || !is_array($data['itens'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Itens não fornecidos']);
        exit;
    }

    if (empty($data['metodo_pagamento'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Método de pagamento não fornecido']);
        exit;
    }

    $metodo_pagamento = $data['metodo_pagamento'];
    if (!in_array($metodo_pagamento, ['pix', 'cartao'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Método de pagamento inválido']);
        exit;
    }

    // ============================================
    // OBS-01: validar o pagamento JUNTO AO PROVEDOR
    // antes de registrar qualquer venda.
    // O frontend envia payment_id (id do Mercado Pago
    // ou correlationID/txid da Woovi). Confiamos no
    // provedor, nunca no navegador.
    // ============================================
    $payment_id = trim((string) ($data['payment_id'] ?? ''));
    if ($payment_id === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'error' => 'payment_id é obrigatório para registrar a venda'
        ]);
        exit;
    }

    if (!function_exists('validarPagamentoNoProvedor')) {
        /**
         * Consulta o status do pagamento direto na API do provedor.
         * Retorna [bool $aprovado, ?string $erro].
         */
        function validarPagamentoNoProvedor(string $metodo, string $paymentId): array {
            if ($metodo === 'cartao') {
                $ch = curl_init('https://api.mercadopago.com/v1/payments/' . urlencode($paymentId));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: Bearer ' . MP_ACCESS_TOKEN
                ]);
            } else { // pix
                $ch = curl_init('https://api.woovi.com/api/v1/charge/' . urlencode($paymentId));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: ' . OPENPIX_API_KEY
                ]);
            }

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($response === false || $httpCode !== 200) {
                return [false, 'Falha ao consultar pagamento no provedor'];
            }

            $dados = json_decode($response, true);
            if (!is_array($dados)) {
                return [false, 'Resposta inválida do provedor'];
            }

            if ($metodo === 'cartao') {
                $aprovado = (($dados['status'] ?? '') === 'approved');
            } else {
                $status = strtoupper((string) ($dados['status'] ?? ''));
                $aprovado = in_array($status, ['PAID', 'COMPLETED', 'CONFIRMED'], true)
                    || ($dados['paid'] ?? false) === true
                    || !empty($dados['paidAt']);
            }

            return [$aprovado, $aprovado ? null : 'Pagamento não aprovado no provedor'];
        }
    }

    [$pagamento_aprovado, $erro_validacao] = validarPagamentoNoProvedor($metodo_pagamento, $payment_id);

    if (!$pagamento_aprovado) {
        error_log('[VENDAS_CREATE] Pagamento não validado (' . $metodo_pagamento . ' / ' . $payment_id . '): ' . ($erro_validacao ?? '?'));
        http_response_code(402);
        echo json_encode([
            'success' => false,
            'error' => $erro_validacao ?? 'Pagamento não confirmado'
        ]);
        exit;
    }

    // Anti-replay: a mesma confirmação de pagamento não pode gerar duas vendas
    $venda_existente = $database->fetchOne(
        "SELECT id FROM vendas WHERE payment_id = ? LIMIT 1",
        [$payment_id]
    );
    if ($venda_existente) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error' => 'Venda já registrada para este pagamento',
            'venda_id' => $venda_existente['id']
        ]);
        exit;
    }

    try {
        $pdo = $database->getConnection();
        $pdo->beginTransaction();

        $total_vendido = 0;
        $itens_processados = [];

        foreach ($data['itens'] as $item) {
            $presenteId = (int) ($item['id'] ?? 0);
            $quantidade = $item['quantity'] ?? 0;

            // Validação rigorosa de quantity
            if (!is_numeric($quantidade)) {
                throw new RuntimeException("Quantidade deve ser numérica (item: {$presenteId})");
            }

            $quantidade = (int) $quantidade;

            // Validar que é inteiro positivo
            if ($quantidade <= 0) {
                throw new RuntimeException("Quantidade deve ser maior que zero (item: {$presenteId})");
            }

            // Validar limite máximo por item (anti-fraude)
            if ($quantidade > 10) {
                throw new RuntimeException("Quantidade máxima por item é 10 (item: {$presenteId})");
            }

            if ($presenteId <= 0) {
                throw new RuntimeException("ID do presente inválido");
            }

            // Verificar se presente existe e tem cotas disponíveis
            $query = "SELECT preco, cotas_disponiveis FROM presentes WHERE id = ? AND ativo = 1";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$presenteId]);
            $presente = $stmt->fetch();

            if (!$presente) {
                throw new RuntimeException("Presente {$presenteId} não encontrado");
            }

            if ($presente['cotas_disponiveis'] < $quantidade) {
                throw new RuntimeException("Presente {$presenteId} não possui cotas suficientes");
            }

            $preco = (float) $presente['preco'];
            $subtotal = $preco * $quantidade;

            // Registrar venda (payment_id permite auditoria e bloqueia replay)
            $stmt = $pdo->prepare("
                INSERT INTO vendas (presente_id, quantidade, preco_unitario, subtotal, metodo_pagamento, payment_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$presenteId, $quantidade, $preco, $subtotal, $metodo_pagamento, $payment_id]);

            // Trigger vai diminuir as cotas automaticamente

            $itens_processados[] = [
                'id' => $presenteId,
                'quantidade' => $quantidade,
                'subtotal' => $subtotal
            ];

            $total_vendido += $subtotal;
        }

        $pdo->commit();

        echo json_encode([
            'success' => true,
            'venda_id' => $pdo->lastInsertId(),
            'total' => $total_vendido,
            'itens' => $itens_processados,
            'metodo_pagamento' => $metodo_pagamento
        ]);

    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log('[VENDAS_ERROR] ' . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'error' => $e->getMessage(),
            'success' => false
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
