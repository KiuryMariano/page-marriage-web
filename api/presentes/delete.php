<?php
/**
 * DELETE /api/presentes/delete.php
 * Deleta um presente (soft delete - define ativo = 0)
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (empty($id)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'ID do presente é obrigatório'
        ]);
        exit;
    }

    // Buscar presente para verificar se existe
    $query = "SELECT * FROM presentes WHERE id = ?";
    $presente = $database->fetchOne($query, [intval($id)]);

    if (!$presente) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Presente não encontrado'
        ]);
        exit;
    }

    try {
        // Soft delete - define ativo = 0
        $query = "UPDATE presentes SET ativo = 0 WHERE id = ?";
        $database->execute($query, [intval($id)]);

        echo json_encode([
            'success' => true,
            'message' => 'Presente desativado com sucesso'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao desativar presente: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
