<?php
/**
 * Middleware de Autenticação
 * Deve ser incluído no topo de endpoints protegidos
 *
 * Uso:
 * require_once __DIR__ . "/../middleware/require-auth.php";
 * requireAdmin(); // para endpoints que requerem role admin
 */

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

/**
 * Verifica se o usuário está autenticado
 * Retorna 401 se não estiver
 */
function requireAuth(): void
{
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Autenticação necessária'
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
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Sessão expirada'
        ]);
        exit;
    }

    // Atualizar última atividade
    $_SESSION['last_activity'] = time();
}

/**
 * Verifica se o usuário tem role admin
 * Retorna 403 se não tiver
 */
function requireAdmin(): void
{
    requireAuth();

    if (!isset($_SESSION['admin_role']) || $_SESSION['admin_role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Permissão insuficiente'
        ]);
        exit;
    }
}

/**
 * Retorna os dados do usuário autenticado
 */
function getAuthUser(): ?array
{
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        return null;
    }

    return [
        'id' => $_SESSION['admin_id'] ?? null,
        'username' => $_SESSION['admin_username'] ?? null,
        'role' => $_SESSION['admin_role'] ?? null,
    ];
}

/**
 * Configura CORS para endpoints protegidos
 */
function setProtectedCors(): void
{
    $allowedOrigins = ['https://casamentokiuryeleticia.com.br', 'http://localhost:5173'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Max-Age: 86400');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// Aplicar CORS automaticamente para endpoints protegidos
setProtectedCors();
