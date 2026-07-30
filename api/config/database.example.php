<?php
/**
 * ============================================
 * Exemplo de Configuração - Banco de Dados
 * ============================================
 *
 * Renomeie para database.php e preencha suas credenciais reais
 * Este arquivo é seguro para versionar (sem credenciais reais)
 */

class Database
{
    private PDO $conn;

    // HOSTINGER (PRODUÇÃO) - PHP e MySQL no mesmo servidor
    private string $host_production = 'localhost';
    private string $db_name_production = 'uXXXXXX_casamento_db'; // Exemplo
    private string $username_production = 'uXXXXXX_user'; // Exemplo
    private string $password_production = 'sua_senha_hostinger'; // Senha forte

    // LOCAL (DESENVOLVIMENTO) - Acesso remoto ao MySQL Hostinger
    // Hostname fornecido pela Hostinger ao configurar acesso remoto
    private string $host_local = 'srvXXX.hstgr.io'; // Exemplo: srv1965.hstgr.io
    private string $db_name_local = 'uXXXXXX_casamento_db';
    private string $username_local = 'uXXXXXX_user';
    private string $password_local = 'sua_senha_hostinger';

    // ... resto do código igual ao database.php
}
