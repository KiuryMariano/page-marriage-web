<?php
/**
 * GET /api/presentes/get-single.php
 * Busca um único presente por ID
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    if (empty($id)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'ID do presente é obrigatório'
        ]);
        exit;
    }

    try {
        $query = "
            SELECT
                id, nome, preco, categoria, imagem_url,
                cotas_totais, cotas_disponiveis,
                (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
                ativo,
                CASE
                    WHEN cotas_disponiveis = 0 THEN 'esgotado'
                    WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                    ELSE 'disponivel'
                END AS status_cotas
            FROM presentes
            WHERE id = ?
        ";

        $presente = $database->fetchOne($query, [intval($id)]);

        if (!$presente) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Presente não encontrado'
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'data' => $presente
        ]);
    } catch (Exception $e) {
        error_log('[PRESENTES_GET_SINGLE] ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao buscar presente'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
