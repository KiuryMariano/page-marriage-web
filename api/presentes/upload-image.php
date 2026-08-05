<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Diretório para salvar as imagens (um nível acima da pasta api)
$uploadDir = __DIR__ . '/../../imagens-presentes/';

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
