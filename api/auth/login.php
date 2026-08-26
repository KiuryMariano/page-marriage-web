<?php
/**
 * POST /api/auth/login.php
 * Endpoint de login - Autentica usuários administrativos
 */

// Iniciar sessão antes de qualquer output
if (session_status() === PHP_SESSION_NONE) {
    // Cookie HttpOnly (XSS não lê) + SameSite Lax + Secure apenas em HTTPS
    $isHttps = (
        ($_SERVER['HTTPS'] ?? '') !== '' ||
        ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' ||
        ($_SERVER['SERVER_PORT'] ?? '') == 443
    );
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

header('Content-Type: application/json');

// CORS estrito
$allowedOrigins = ['https://casamentokiuryeleticia.com.br', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Método não permitido para não-POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Mesma conexão usada pelos endpoints de presentes/vendas
require_once '../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Validar entrada
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Usuário e senha são obrigatórios'
    ]);
    exit;
}

try {
    $database = new Database();

    // Buscar usuário no banco
    $admin = $database->fetchOne(
        "SELECT id, username, password_hash, role, ativo FROM admin_users WHERE username = ?",
        [$username]
    );

    if (!$admin) {
        error_log('[AUTH_FAIL] Usuário não encontrado: ' . $username);
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Credenciais inválidas'
        ]);
        exit;
    }

    // Verificar se está ativo
    if (!$admin['ativo']) {
        error_log('[AUTH_FAIL] Usuário desativado: ' . $username);
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Usuário desativado'
        ]);
        exit;
    }

    // Verificar senha
    if (!password_verify($password, $admin['password_hash'])) {
        error_log('[AUTH_FAIL] Senha incorreta para: ' . $username);
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Credenciais inválidas'
        ]);
        exit;
    }

    // Regenerar session ID para previnir session fixation
    session_regenerate_id(true);

    // Armazenar dados na sessão
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    $_SESSION['admin_role'] = $admin['role'];
    $_SESSION['login_time'] = time();
    $_SESSION['last_activity'] = time();

    // Atualizar último login no banco
    $database->execute(
        "UPDATE admin_users SET last_login = NOW() WHERE id = ?",
        [$admin['id']]
    );

    error_log('[AUTH_SUCCESS] Login bem-sucedido: ' . $username);

    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso',
        'data' => [
            'username' => $admin['username'],
            'role' => $admin['role']
        ]
    ]);

} catch (Exception $e) {
    error_log('[AUTH_ERROR] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao processar login'
    ]);
}
