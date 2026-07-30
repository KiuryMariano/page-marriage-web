<?php
/**
 * GET /api/presentes/status.php
 * Verifica o status de um presente específico (cotas disponíveis)
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID não fornecido']);
        exit;
    }

    $query = "
        SELECT
            id, nome, preco, categoria, imagem_url,
            cotas_totais, cotas_disponiveis,
            (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
            ROUND(((cotas_totais - cotas_disponiveis) / cotas_totais) * 100, 1) AS porcentaje_vendido,
            CASE
                WHEN cotas_disponiveis = 0 THEN 'esgotado'
                WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                ELSE 'disponivel'
            END AS status_cotas
        FROM presentes
        WHERE id = ? AND ativo = 1
    ";

    $presente = $database->fetchOne($query, [$id]);

    if (!$presente) {
        http_response_code(404);
        echo json_encode(['error' => 'Presente não encontrado']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data' => $presente
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
