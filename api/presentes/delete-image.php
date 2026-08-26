<?php
/**
 * DELETE/POST /api/presentes/delete-image.php
 * Deleta imagem de presente (PROTEGIDO)
 */

require_once __DIR__ . '/../middleware/require-auth.php';
requireAdmin();

header('Content-Type: application/json');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log('[delete-image] Iniciando deleção de imagem');

// Obter o caminho da imagem
$json = file_get_contents('php://input');
$data = json_decode($json, true);

error_log('[delete-image] Data recebida: ' . print_r($data, true));

// Ou pode vir via POST
if (empty($data)) {
    $data = $_POST;
}

if (!isset($data['image_url']) || empty($data['image_url'])) {
    error_log('[delete-image] Erro: Caminho da imagem não fornecido');
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Caminho da imagem não fornecido'
    ]);
    exit;
}

$imageUrl = $data['image_url'];
error_log('[delete-image] URL da imagem: ' . $imageUrl);

// Validar que o caminho começa com /imagens-presentes/ para evitar path traversal
if (strpos($imageUrl, '/imagens-presentes/') !== 0 && strpos($imageUrl, 'imagens-presentes/') !== 0) {
    error_log('[delete-image] Erro: Caminho de imagem inválido: ' . $imageUrl);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Caminho de imagem inválido. Deve começar com /imagens-presentes/'
    ]);
    exit;
}

// Obter o nome do arquivo
$fileName = basename($imageUrl);

// Construir o caminho completo no servidor
// delete-image.php está em: /home/usuario/public_html/api/presentes/
// imagens-presentes está em: /home/usuario/public_html/imagens-presentes/
// Precisamos subir 3 níveis: presentes -> api -> public_html -> imagens-presentes
$baseDir = dirname(dirname(dirname(__DIR__))); // Sobe 3 níveis
$filePath = $baseDir . '/imagens-presentes/' . $fileName;

// Fallback: tenta usar DOCUMENT_ROOT
if (!file_exists($filePath)) {
    $filePath = $_SERVER['DOCUMENT_ROOT'] . '/imagens-presentes/' . $fileName;
}

error_log('[delete-image] Caminho base: ' . $baseDir);
error_log('[delete-image] DOCUMENT_ROOT: ' . $_SERVER['DOCUMENT_ROOT']);
error_log('[delete-image] Caminho do arquivo: ' . $filePath);
error_log('[delete-image] Arquivo existe? ' . (file_exists($filePath) ? 'SIM' : 'NÃO'));

// Verificar se o arquivo existe
if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo não encontrado no servidor: ' . $fileName
    ]);
    exit;
}

// Verificar se é realmente uma imagem (validação adicional)
$allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $filePath);
    finfo_close($finfo);

    error_log('[delete-image] MIME type detectado: ' . $mimeType);

    if (!in_array($mimeType, $allowedMimeTypes)) {
        error_log('[delete-image] Erro: MIME type não permitido: ' . $mimeType);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Arquivo não é uma imagem válida (MIME: ' . $mimeType . ')'
        ]);
        exit;
    }
}

// Verificar permissões antes de tentar deletar
if (!is_writable($filePath)) {
    error_log('[delete-image] Erro: Arquivo não tem permissão de escrita');
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo não tem permissão para ser deletado'
    ]);
    exit;
}

// Verificar permissões da pasta
$folderPath = dirname($filePath);
if (!is_writable($folderPath)) {
    error_log('[delete-image] Erro: Pasta não tem permissão de escrita: ' . $folderPath);
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Pasta de imagens não tem permissão para deletar arquivos'
    ]);
    exit;
}

// Tentar deletar o arquivo
if (unlink($filePath)) {
    error_log('[delete-image] Sucesso: Imagem deletada');
    echo json_encode([
        'success' => true,
        'message' => 'Imagem deletada com sucesso do servidor'
    ]);
} else {
    $lastError = error_get_last();
    $errorMessage = $lastError ? $lastError['message'] : 'Erro desconhecido';
    error_log('[delete-image] Erro ao deletar arquivo: ' . $errorMessage);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao deletar imagem do servidor: ' . $errorMessage
    ]);
}
