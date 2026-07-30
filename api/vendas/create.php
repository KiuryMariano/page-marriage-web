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

    try {
        $pdo = $database->getConnection();
        $pdo->beginTransaction();

        $total_vendido = 0;
        $itens_processados = [];

        foreach ($data['itens'] as $item) {
            $presenteId = (int) ($item['id'] ?? 0);
            $quantidade = (int) ($item['quantity'] ?? 1);

            if ($presenteId <= 0 || $quantidade <= 0) {
                continue;
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

            // Registrar venda
            $stmt = $pdo->prepare("
                INSERT INTO vendas (presente_id, quantidade, preco_unitario, subtotal, metodo_pagamento)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$presenteId, $quantidade, $preco, $subtotal, $metodo_pagamento]);

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
