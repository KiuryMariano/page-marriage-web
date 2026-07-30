<?php
/**
 * GET /api/presentes/list.php
 * Lista todos os presentes ativos ou filtra por categoria
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $categoria = $_GET['categoria'] ?? null;

    if ($categoria) {
        // Validar categoria
        $categorias_validas = ['eletros', 'casa', 'divertidos', 'utensilios', 'vales'];
        if (!in_array($categoria, $categorias_validas)) {
            http_response_code(400);
            echo json_encode(['error' => 'Categoria inválida']);
            exit;
        }

        $query = "
            SELECT
                id, nome, preco, categoria, imagem_url,
                cotas_totais, cotas_disponiveis,
                (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
                CASE
                    WHEN cotas_disponiveis = 0 THEN 'esgotado'
                    WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                    ELSE 'disponivel'
                END AS status_cotas
            FROM presentes
            WHERE ativo = 1 AND categoria = ?
            ORDER BY RAND()
        ";
        $presentes = $database->fetchAll($query, [$categoria]);
    } else {
        $query = "
            SELECT
                id, nome, preco, categoria, imagem_url,
                cotas_totais, cotas_disponiveis,
                (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
                CASE
                    WHEN cotas_disponiveis = 0 THEN 'esgotado'
                    WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                    ELSE 'disponivel'
                END AS status_cotas
            FROM presentes
            WHERE ativo = 1
            ORDER BY RAND()
        ";
        $presentes = $database->fetchAll($query);
    }

    echo json_encode([
        'success' => true,
        'data' => $presentes,
        'total' => count($presentes)
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
