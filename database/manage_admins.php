<?php
/**
 * Script de Gerenciamento de Administradores
 *
 * Uso via linha de comando:
 * php manage_admins.php
 *
 * Este script oferece um menu interativo para:
 * - Listar administradores
 * - Criar novo administrador
 * - Alterar senha
 * - Ativar/desativar usuário
 * - Resetar tentativas de login
 */

// Carregar configuração do banco
require_once __DIR__ . '/../database/db.php';

// Cores para terminal
define('COLOR_GREEN', "\033[32m");
define('COLOR_RED', "\033[31m");
define('COLOR_YELLOW', "\033[33m");
define('COLOR_BLUE', "\033[36m");
define('COLOR_RESET', "\033[0m");

function printSuccess($message) {
    echo COLOR_GREEN . "✓ " . $message . COLOR_RESET . PHP_EOL;
}

function printError($message) {
    echo COLOR_RED . "✗ " . $message . COLOR_RESET . PHP_EOL;
}

function printInfo($message) {
    echo COLOR_BLUE . "ℹ " . $message . COLOR_RESET . PHP_EOL;
}

function printWarning($message) {
    echo COLOR_YELLOW . "⚠ " . $message . COLOR_RESET . PHP_EOL;
}

function clearScreen() {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        system('cls');
    } else {
        system('clear');
    }
}

// ============================================
// FUNÇÕES DE GERENCIAMENTO
// ============================================

function listAdmins() {
    echo PHP_EOL . "=== Administradores Cadastrados ===" . PHP_EOL . PHP_EOL;

    try {
        $admins = dbFetchAll("
            SELECT
                id,
                username,
                role,
                ativo,
                created_at,
                last_login,
                login_attempts,
                locked_until
            FROM admin_users
            ORDER BY id
        ");

        if (empty($admins)) {
            printWarning("Nenhum administrador encontrado.");
            return;
        }

        foreach ($admins as $admin) {
            $status = $admin['ativo'] ? COLOR_GREEN . 'Ativo' . COLOR_RESET : COLOR_RED . 'Inativo' . COLOR_RESET;
            $lastLogin = $admin['last_login'] ? date('d/m/Y H:i', strtotime($admin['last_login'])) : 'Nunca';

            echo "ID: " . $admin['id'] . PHP_EOL;
            echo "Usuário: " . $admin['username'] . PHP_EOL;
            echo "Role: " . $admin['role'] . PHP_EOL;
            echo "Status: " . $status . PHP_EOL;
            echo "Último login: " . $lastLogin . PHP_EOL;
            echo "Tentativas: " . $admin['login_attempts'] . PHP_EOL;

            if ($admin['locked_until']) {
                $lockedUntil = date('d/m/Y H:i', strtotime($admin['locked_until']));
                if (strtotime($admin['locked_until']) > time()) {
                    echo COLOR_RED . "Bloqueado até: " . $lockedUntil . COLOR_RESET . PHP_EOL;
                }
            }

            echo str_repeat('-', 40) . PHP_EOL;
        }
    } catch (Exception $e) {
        printError("Erro ao listar: " . $e->getMessage());
    }
}

function createAdmin() {
    echo PHP_EOL . "=== Criar Novo Administrador ===" . PHP_EOL . PHP_EOL;

    $username = readline("Nome de usuário: ");
    $password = readline("Senha: ");
    $confirmPassword = readline("Confirme a senha: ");

    if (empty($username) || empty($password)) {
        printError("Usuário e senha são obrigatórios.");
        return;
    }

    if ($password !== $confirmPassword) {
        printError("As senhas não conferem.");
        return;
    }

    if (strlen($password) < 8) {
        printError("A senha deve ter pelo menos 8 caracteres.");
        return;
    }

    try {
        // Verificar se já existe
        $existing = dbFetchOne("SELECT id FROM admin_users WHERE username = ?", [$username]);
        if ($existing) {
            printError("Usuário já existe.");
            return;
        }

        // Criar hash da senha
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Inserir
        dbExecute("
            INSERT INTO admin_users (username, password_hash, role, ativo)
            VALUES (?, ?, 'admin', 1)
        ", [$username, $passwordHash]);

        printSuccess("Administrador criado com sucesso!");
        printInfo("Usuário: " . $username);

    } catch (Exception $e) {
        printError("Erro ao criar: " . $e->getMessage());
    }
}

function changePassword() {
    echo PHP_EOL . "=== Alterar Senha ===" . PHP_EOL . PHP_EOL;

    $username = readline("Nome de usuário: ");
    $newPassword = readline("Nova senha: ");
    $confirmPassword = readline("Confirme a nova senha: ");

    if (empty($username) || empty($newPassword)) {
        printError("Usuário e senha são obrigatórios.");
        return;
    }

    if ($newPassword !== $confirmPassword) {
        printError("As senhas não conferem.");
        return;
    }

    if (strlen($newPassword) < 8) {
        printError("A senha deve ter pelo menos 8 caracteres.");
        return;
    }

    try {
        // Verificar se usuário existe
        $admin = dbFetchOne("SELECT id FROM admin_users WHERE username = ?", [$username]);
        if (!$admin) {
            printError("Usuário não encontrado.");
            return;
        }

        // Criar hash da senha
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        // Atualizar
        dbExecute("
            UPDATE admin_users
            SET password_hash = ?, updated_at = NOW()
            WHERE username = ?
        ", [$passwordHash, $username]);

        printSuccess("Senha alterada com sucesso!");

    } catch (Exception $e) {
        printError("Erro ao alterar: " . $e->getMessage());
    }
}

function toggleActive() {
    echo PHP_EOL . "=== Ativar/Desativar Usuário ===" . PHP_EOL . PHP_EOL;

    $username = readline("Nome de usuário: ");

    try {
        $admin = dbFetchOne("SELECT id, ativo FROM admin_users WHERE username = ?", [$username]);
        if (!$admin) {
            printError("Usuário não encontrado.");
            return;
        }

        $novoStatus = $admin['ativo'] ? 0 : 1;
        $statusTexto = $novoStatus ? 'ATIVADO' : 'DESATIVADO';

        dbExecute("
            UPDATE admin_users SET ativo = ? WHERE username = ?
        ", [$novoStatus, $username]);

        printSuccess("Usuário $statusTexto com sucesso!");

    } catch (Exception $e) {
        printError("Erro: " . $e->getMessage());
    }
}

function resetAttempts() {
    echo PHP_EOL . "=== Resetar Tentativas de Login ===" . PHP_EOL . PHP_EOL;

    $username = readline("Nome de usuário: ");

    try {
        dbExecute("
            UPDATE admin_users
            SET login_attempts = 0, locked_until = NULL
            WHERE username = ?
        ", [$username]);

        printSuccess("Tentativas resetadas com sucesso!");

    } catch (Exception $e) {
        printError("Erro: " . $e->getMessage());
    }
}

function showStats() {
    echo PHP_EOL . "=== Estatísticas ===" . PHP_EOL . PHP_EOL;

    try {
        $total = dbFetchOne("SELECT COUNT(*) as total FROM admin_users")['total'];
        $ativos = dbFetchOne("SELECT COUNT(*) as total FROM admin_users WHERE ativo = 1")['total'];
        $logs = dbFetchOne("SELECT COUNT(*) as total FROM admin_login_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")['total'];

        echo "Total de administradores: " . $total . PHP_EOL;
        echo "Administradores ativos: " . $ativos . PHP_EOL;
        echo "Tentativas de login (24h): " . $logs . PHP_EOL;

    } catch (Exception $e) {
        printError("Erro: " . $e->getMessage());
    }
}

// ============================================
// MENU PRINCIPAL
// ============================================

function showMenu() {
    clearScreen();
    echo PHP_EOL;
    echo COLOR_BLUE . "╔══════════════════════════════════════╗" . COLOR_RESET . PHP_EOL;
    echo COLOR_BLUE . "║   Gerenciador de Administradores     ║" . COLOR_RESET . PHP_EOL;
    echo COLOR_BLUE . "║   Casamento Letícia & Kiury          ║" . COLOR_RESET . PHP_EOL;
    echo COLOR_BLUE . "╚══════════════════════════════════════╝" . COLOR_RESET . PHP_EOL;
    echo PHP_EOL;
    echo "1. Listar administradores" . PHP_EOL;
    echo "2. Criar novo administrador" . PHP_EOL;
    echo "3. Alterar senha" . PHP_EOL;
    echo "4. Ativar/Desativar usuário" . PHP_EOL;
    echo "5. Resetar tentativas de login" . PHP_EOL;
    echo "6. Mostrar estatísticas" . PHP_EOL;
    echo "0. Sair" . PHP_EOL;
    echo PHP_EOL;
}

// ============================================
// LOOP PRINCIPAL
// ============================================

$option = '';

while ($option !== '0') {
    showMenu();
    $option = readline("Escolha uma opção: ");

    switch ($option) {
        case '1':
            listAdmins();
            break;
        case '2':
            createAdmin();
            break;
        case '3':
            changePassword();
            break;
        case '4':
            toggleActive();
            break;
        case '5':
            resetAttempts();
            break;
        case '6':
            showStats();
            break;
        case '0':
            printInfo("Saindo...");
            break;
        default:
            printError("Opção inválida.");
    }

    if ($option !== '0') {
        echo PHP_EOL . "Pressione Enter para continuar...";
        readline();
    }
}
