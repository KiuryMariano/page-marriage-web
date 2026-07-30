<?php
/**
 * GET /api/vendas/list.php
 * Lista vendas realizadas (endpoint para admin)
 * Em produção, deve adicionar autenticação
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $limit = (int) ($_GET['limit'] ?? 50);
    $offset = (int) ($_GET['offset'] ?? 0);

    $query = "
        SELECT
            v.id,
            v.presente_id,
            p.nome AS presente_nome,
            v.quantidade,
            v.preco_unitario,
            v.subtotal,
            v.metodo_pagamento,
            v.created_at
        FROM vendas v
        INNER JOIN presentes p ON v.presente_id = p.id
        ORDER BY v.created_at DESC
        LIMIT ? OFFSET ?
    ";

    $vendas = $database->fetchAll($query, [$limit, $offset]);

    // Total de vendas
    $total_query = "SELECT COUNT(*) AS total FROM vendas";
    $total_result = $database->fetchOne($total_query);
    $total = $total_result['total'] ?? 0;

    echo json_encode([
        'success' => true,
        'data' => $vendas,
        'total' => (int) $total,
        'limit' => $limit,
        'offset' => $offset
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
