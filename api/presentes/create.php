<?php
/**
 * POST /api/presentes/create.php
 * Cria um novo presente
 */

require_once __DIR__ . '/../middleware/require-auth.php';
requireAdmin();

require_once '../config/database.php';

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validação básica
    if (empty($data['nome']) || empty($data['preco']) || empty($data['categoria'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nome, preço e categoria são obrigatórios'
        ]);
        exit;
    }

    // Valida categoria
    $categorias_validas = ['eletros', 'casa', 'divertidos', 'utensilios', 'vales'];
    if (!in_array($data['categoria'], $categorias_validas)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Categoria inválida. Categorias válidas: ' . implode(', ', $categorias_validas)
        ]);
        exit;
    }

    // Valida preço
    $preco = floatval($data['preco']);
    if ($preco <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Preço deve ser maior que zero'
        ]);
        exit;
    }

    // Valida cotas
    $cotas_totais = !empty($data['cotas_totais']) ? intval($data['cotas_totais']) : 1;
    if ($cotas_totais < 1) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Cotas totais deve ser pelo menos 1'
        ]);
        exit;
    }

    $cotas_disponiveis = !empty($data['cotas_disponiveis']) ? intval($data['cotas_disponiveis']) : $cotas_totais;
    if ($cotas_disponiveis > $cotas_totais) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Cotas disponíveis não pode ser maior que cotas totais'
        ]);
        exit;
    }

    $imagem_url = $data['imagem_url'] ?? null;

    try {
        $query = "
            INSERT INTO presentes (nome, preco, categoria, imagem_url, cotas_totais, cotas_disponiveis, ativo)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ";

        $database->execute($query, [
            $data['nome'],
            $preco,
            $data['categoria'],
            $imagem_url,
            $cotas_totais,
            $cotas_disponiveis
        ]);

        $id = $database->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Presente criado com sucesso',
            'id' => $id
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao criar presente: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
