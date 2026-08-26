<?php
/**
 * POST /api/presentes/upload-image.php
 * Upload de imagens de presentes (PROTEGIDO)
 */

require_once __DIR__ . '/../middleware/require-auth.php';
requireAdmin();

header('Content-Type: application/json');

// Diretório para salvar as imagens no servidor
// upload-image.php está em: /home/usuario/public_html/api/presentes/
// imagens-presentes está em: /home/usuario/public_html/imagens-presentes/
$baseDir = dirname(dirname(dirname(__DIR__))); // Sobe 3 níveis
$uploadDir = $baseDir . '/imagens-presentes/';

// Fallback: tenta usar DOCUMENT_ROOT
if (!is_dir($uploadDir)) {
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/imagens-presentes/';
}

// Criar diretório se não existir
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Verificar se há arquivo
if (!isset($_FILES['imagem']) || $_FILES['imagem']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Nenhum arquivo enviado ou erro no upload'
    ]);
    exit;
}

$file = $_FILES['imagem'];

// Verificar tamanho máximo (5MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo muito grande. Máximo 5MB'
    ]);
    exit;
}

// Obter extensão do arquivo
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Obter nome do presente para usar no arquivo
$nomePresente = isset($_POST['nome']) ? $_POST['nome'] : 'presente';

// Sanitizar o nome: remover acentos, caracteres especiais e espaços
$nomeSanitizado = preg_replace('/[^a-zA-Z0-9]/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $nomePresente));
$nomeSanitizado = trim($nomeSanitizado, '-');
$nomeSanitizado = strtolower($nomeSanitizado);

// Data atual no formato Y-m-d
$dataAtual = date('Y-m-d');

// Gerar nome do arquivo: titulo-dataatual.extensao
$fileName = $nomeSanitizado . '-' . $dataAtual . '.' . $extension;
$filePath = $uploadDir . $fileName;

// Mover arquivo
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Retornar o caminho relativo para acesso via web
    $webPath = '/imagens-presentes/' . $fileName;

    echo json_encode([
        'success' => true,
        'data' => [
            'path' => $webPath,
            'fileName' => $fileName
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao salvar arquivo'
    ]);
}
