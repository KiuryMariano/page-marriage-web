<?php
/**
 * POST /api/auth/logout.php
 * Endpoint de logout - Destrói sessão do usuário
 */

// Iniciar sessão antes de qualquer output
if (session_status() === PHP_SESSION_NONE) {
    // Deve usar os MESMOS parâmetros do login.php
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

// Destruir todos os dados da sessão
$_SESSION = [];

// Se quiser destruir a sessão completamente, apague também o cookie de sessão
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Finalmente, destrói a sessão
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logout realizado com sucesso'
]);
