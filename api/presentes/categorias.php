<?php
/**
 * GET /api/presentes/categorias.php
 * Retorna estatísticas por categoria e lista de categorias disponíveis
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Estatísticas por categoria
    $query = "
        SELECT
            categoria,
            COUNT(*) AS total_presentes,
            SUM(cotas_totais) AS total_cotas_geral,
            SUM(cotas_disponiveis) AS total_cotas_disponiveis,
            SUM(cotas_totais - cotas_disponiveis) AS total_cotas_vendidas,
            ROUND(AVG(preco), 2) AS preco_medio
        FROM presentes
        WHERE ativo = 1
        GROUP BY categoria
        ORDER BY categoria
    ";
    $stats = $database->fetchAll($query);

    // Nomes formatados das categorias
    $nomes = [
        'eletros' => 'Eletros',
        'casa' => 'Casa',
        'divertidos' => 'Divertidos',
        'utensilios' => 'Utensílios',
        'vales' => 'Vales',
    ];

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'categorias' => $nomes
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
