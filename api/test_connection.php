<?php
/**
 * Script de teste de conexão com o banco
 * Execute: php api/test_connection.php
 */

require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    echo "✅ Conexão com banco estabelecida!\n\n";

    // Testar query simples
    $result = $database->fetchOne("SELECT COUNT(*) AS total FROM presentes");
    echo "📦 Total de presentes: " . ($result['total'] ?? 0) . "\n";

    // Listar categorias
    $cats = $database->fetchAll("SELECT DISTINCT categoria FROM presentes ORDER BY categoria");
    echo "\n🏷️ Categorias:\n";
    foreach ($cats as $cat) {
        echo "  - " . $cat['categoria'] . "\n";
    }

    echo "\n✅ Tudo funcionando corretamente!\n";

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
    echo "\nDicas:\n";
    echo "1. Verifique se o banco foi criado na Hostinger\n";
    echo "2. Execute o schema.sql via phpMyAdmin\n";
    echo "3. Se acesso remoto, configure o hostname corretamente\n";
}
