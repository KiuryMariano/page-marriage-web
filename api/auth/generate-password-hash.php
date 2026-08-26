<?php
/**
 * Script para gerar hash de senha
 * Execute via linha de comando: php generate-password-hash.php
 */

$senha = readline("Digite a senha para gerar o hash: ");

if (empty($senha)) {
    echo "Senha não pode ser vazia\n";
    exit(1);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);

echo "\n=== Hash Gerado ===\n";
echo $hash . "\n\n";

echo "=== SQL para inserir no banco ===\n";
echo "INSERT INTO admin_users (username, password_hash, role, ativo)\n";
echo "VALUES ('admin', '" . $hash . "', 'admin', 1);\n\n";

echo "Verificação: ";
echo password_verify($senha, $hash) ? "VÁLIDA ✓" : "INVÁLIDA ✗";
echo "\n";
