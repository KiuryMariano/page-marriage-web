<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Obter o caminho da imagem
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Ou pode vir via POST
if (empty($data)) {
    $data = $_POST;
}

if (!isset($data['image_url']) || empty($data['image_url'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Caminho da imagem não fornecido'
    ]);
    exit;
}

$imageUrl = $data['image_url'];

// Validar que o caminho começa com /imagens-presentes/ para evitar path traversal
if (strpos($imageUrl, '/imagens-presentes/') !== 0 && strpos($imageUrl, 'imagens-presentes/') !== 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Caminho de imagem inválido'
    ]);
    exit;
}

// Obter o caminho completo do arquivo
// Se começar com /, removemos e usamos o caminho relativo
$fileName = basename($imageUrl);
$filePath = __DIR__ . '/../../imagens-presentes/' . $fileName;

// Verificar se o arquivo existe
if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo não encontrado'
    ]);
    exit;
}

// Verificar se é realmente uma imagem (validação adicional)
$allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $filePath);
finfo_close($finfo);

if (!in_array($mimeType, $allowedMimeTypes)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo não é uma imagem válida'
    ]);
    exit;
}

// Deletar o arquivo
if (unlink($filePath)) {
    echo json_encode([
        'success' => true,
        'message' => 'Imagem deletada com sucesso'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao deletar imagem'
    ]);
}
