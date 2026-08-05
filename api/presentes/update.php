<?php
/**
 * PUT /api/presentes/update.php
 * Atualiza um presente existente
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validação básica
    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'ID do presente é obrigatório'
        ]);
        exit;
    }

    // Buscar presente existente
    $query = "SELECT * FROM presentes WHERE id = ?";
    $presente = $database->fetchOne($query, [intval($data['id'])]);

    if (!$presente) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Presente não encontrado'
        ]);
        exit;
    }

    // Valida categoria se fornecida
    if (!empty($data['categoria'])) {
        $categorias_validas = ['eletros', 'casa', 'divertidos', 'utensilios', 'vales'];
        if (!in_array($data['categoria'], $categorias_validas)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Categoria inválida'
            ]);
            exit;
        }
    }

    // Valida preço se fornecido
    if (isset($data['preco']) && floatval($data['preco']) <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Preço deve ser maior que zero'
        ]);
        exit;
    }

    // Montar query dinâmica
    $fields = [];
    $params = [];

    if (!empty($data['nome'])) {
        $fields[] = 'nome = ?';
        $params[] = $data['nome'];
    }
    if (isset($data['preco'])) {
        $fields[] = 'preco = ?';
        $params[] = floatval($data['preco']);
    }
    if (!empty($data['categoria'])) {
        $fields[] = 'categoria = ?';
        $params[] = $data['categoria'];
    }
    if (isset($data['imagem_url'])) {
        $fields[] = 'imagem_url = ?';
        $params[] = $data['imagem_url'] ?? null;
    }
    if (isset($data['cotas_totais'])) {
        $cotas_totais = intval($data['cotas_totais']);
        if ($cotas_totais < 1) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Cotas totais deve ser pelo menos 1'
            ]);
            exit;
        }
        $fields[] = 'cotas_totais = ?';
        $params[] = $cotas_totais;
    }
    if (isset($data['cotas_disponiveis'])) {
        $cotas_disponiveis = intval($data['cotas_disponiveis']);
        $cotas_totais_atual = isset($data['cotas_totais']) ? intval($data['cotas_totais']) : intval($presente['cotas_totais']);

        if ($cotas_disponiveis > $cotas_totais_atual) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Cotas disponíveis não pode ser maior que cotas totais'
            ]);
            exit;
        }
        $fields[] = 'cotas_disponiveis = ?';
        $params[] = $cotas_disponiveis;
    }
    if (isset($data['ativo'])) {
        $fields[] = 'ativo = ?';
        $params[] = $data['ativo'] ? 1 : 0;
    }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nenhum campo para atualizar'
        ]);
        exit;
    }

    $params[] = intval($data['id']);

    try {
        $query = "UPDATE presentes SET " . implode(', ', $fields) . " WHERE id = ?";
        $database->execute($query, $params);

        echo json_encode([
            'success' => true,
            'message' => 'Presente atualizado com sucesso'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao atualizar presente: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
