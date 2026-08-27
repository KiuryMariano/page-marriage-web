<?php
/**
 * Cria um novo usuário administrador no painel /admin
 *
 * Uso (apenas CLI, no servidor ou local):
 *   php database/create_admin.php <usuario>
 *   php database/create_admin.php <usuario> --superadmin
 *
 * A senha é solicitada de forma oculta no terminal e validada
 * (mínimo 8 caracteres, maiúscula, minúscula e número).
 * Requer as credenciais configuradas em api/config/database.php.
 *
 * Exemplos:
 *   php database/create_admin.php admin
 *   php database/create_admin.php kiury --superadmin
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/../api/config/database.php';

// ---------- helpers de terminal ----------
function lerLinha(string $prompt): string
{
    echo $prompt;
    $linha = fgets(STDIN);

    if ($linha === false) {
        // stdin fechado (EOF) — abortar em vez de entrar em loop
        fwrite(STDERR, "\n✗ Entrada encerrada antes de fornecer os dados.\n");
        exit(1);
    }

    return trim($linha);
}

function promptUsuario(array $argv): string
{
    $username = $argv[1] ?? '';

    while ($username === '') {
        $username = lerLinha("Usuário do novo admin: ");
    }

    if (!preg_match('/^[a-zA-Z0-9_.-]{3,50}$/', $username)) {
        fwrite(STDERR, "✗ Usuário inválido. Use 3-50 caracteres: letras, números, ponto, hífen ou underline.\n");
        exit(1);
    }

    return $username;
}

function promptSenha(): string
{
    // Oculta a digitação via stty quando disponível (Linux/macOS)
    $sttyAtual = @shell_exec('stty -a </dev/tty 2>/dev/null');
    $podeOcultar = ($sttyAtual !== null) && strpos($sttyAtual, '-echo') === false;

    if ($podeOcultar) {
        shell_exec('stty -echo </dev/tty');
    }

    $senha = lerLinha("Senha: ");
    echo "\n";

    if ($podeOcultar) {
        shell_exec('stty echo </dev/tty');
    }

    return $senha;
}

// ---------- validação da senha ----------
function validarSenha(string $senha): void
{
    $erros = [];
    if (strlen($senha) < 8)             { $erros[] = 'mínimo de 8 caracteres'; }
    if (!preg_match('/[A-Z]/', $senha)) { $erros[] = 'ao menos uma letra maiúscula'; }
    if (!preg_match('/[a-z]/', $senha)) { $erros[] = 'ao menos uma letra minúscula'; }
    if (!preg_match('/[0-9]/', $senha)) { $erros[] = 'ao menos um número'; }

    if ($erros) {
        fwrite(STDERR, "✗ Senha fraca — exige " . implode(', ', $erros) . ".\n");
        exit(1);
    }
}

// ---------- execução ----------
$username = promptUsuario($argv);
$role     = (isset($argv[2]) && $argv[2] === '--superadmin') ? 'superadmin' : 'admin';

fwrite(STDERR, "Digite a senha (não será exibida):\n");
$senha = promptSenha();
validarSenha($senha);

try {
    $database = new Database();
    // A conexão é aberta na primeira query — força agora para falhar cedo e com mensagem clara
    $database->getConnection();
} catch (Throwable $e) {
    fwrite(STDERR, "✗ Falha ao conectar ao banco (IP liberado no hPanel?). Verifique api/config/database.php\n");
    exit(1);
}

// Não duplicar usuários
$existente = $database->fetchOne(
    "SELECT id FROM admin_users WHERE username = ?",
    [$username]
);
if ($existente) {
    fwrite(STDERR, "✗ O usuário '{$username}' já existe.\n");
    exit(1);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);

$database->execute(
    "INSERT INTO admin_users (username, password_hash, role, ativo) VALUES (?, ?, ?, 1)",
    [$username, $hash, $role]
);

$id = (int) $database->lastInsertId();

echo "✔ Administrador criado com sucesso!\n";
echo "  ID:       {$id}\n";
echo "  Usuário:  {$username}\n";
echo "  Perfil:   {$role}\n";
