<?php
/**
 * GET /api/auth/me.php
 * Endpoint para verificar status da sessão
 * Retorna informações do usuário autenticado ou 401 se não autenticado
 */

// Iniciar sessão antes de qualquer output
if (session_status() === PHP_SESSION_NONE) {
    // Deve usar os MESMOS parâmetros do login.php, senão o cookie muda a cada endpoint
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
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Verificar se está autenticado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'error' => 'Não autenticado'
    ]);
    exit;
}

// Verificar timeout de inatividade (2 horas)
$sessionTimeout = 2 * 60 * 60;
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $sessionTimeout) {
    // Sessão expirada
    session_unset();
    session_destroy();
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'error' => 'Sessão expirada'
    ]);
    exit;
}

// Atualizar última atividade
$_SESSION['last_activity'] = time();

// Retornar dados do usuário autenticado
echo json_encode([
    'success' => true,
    'authenticated' => true,
    'data' => [
        'id' => $_SESSION['admin_id'] ?? null,
        'username' => $_SESSION['admin_username'] ?? null,
        'role' => $_SESSION['admin_role'] ?? null,
        'login_time' => $_SESSION['login_time'] ?? null,
        'session_age' => isset($_SESSION['login_time']) ? (time() - $_SESSION['login_time']) : null
    ]
]);
