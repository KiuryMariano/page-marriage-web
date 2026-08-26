<?php
/**
 * ============================================
 * Exemplo de Configuração - Banco de Dados
 * ============================================
 *
 * Renomeie para database.php e preencha suas credenciais reais
 * Este arquivo é seguro para versionar (sem credenciais reais)
 */

class Database {
    // HOSTINGER - PRODUÇÃO (PHP e MySQL no mesmo servidor)
    private $host_production = 'localhost';
    private $port_production = '3306';
    private $db_name_production = 'uXXXXXX_marriage_db';   // hPanel → Bancos de Dados MySQL
    private $username_production = 'uXXXXXX_admin';        // Mesmo usuário do banco
    private $password_production = 'sua_senha_hostinger';  // Senha forte

    // DESENVOLVIMENTO LOCAL (acesso remoto ao MySQL da Hostinger)
    // Requer IP liberado no hPanel → Bancos de Dados → Conexão remota
    private $host_local = 'srvXXX.hstgr.io';               // Ex: srv1965.hstgr.io
    private $port_local = '3306';
    private $db_name_local = 'uXXXXXX_marriage_db';
    private $username_local = 'uXXXXXX_admin';
    private $password_local = 'sua_senha_hostinger';

    private $charset = 'utf8mb4';
    public $conn;

    /**
     * Detecta se está em produção (Hostinger) ou local.
     * Execução via CLI (sem HTTP_HOST) é tratada como local.
     */
    private function isProduction() {
        $host   = $_SERVER['HTTP_HOST'] ?? '';
        $server = $_SERVER['SERVER_NAME'] ?? '';

        return (
            stripos($host, 'seudominio.com.br') !== false ||
            stripos($server, 'seudominio.com.br') !== false
        );
    }

    public function getConnection() {
        $this->conn = null;

        if ($this->isProduction()) {
            $host     = $this->host_production;
            $port     = $this->port_production;
            $db_name  = $this->db_name_production;
            $username = $this->username_production;
            $password = $this->password_production;
        } else {
            $host     = $this->host_local;
            $port     = $this->port_local;
            $db_name  = $this->db_name_local;
            $username = $this->username_local;
            $password = $this->password_local;
        }

        try {
            $dsn = "mysql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $this->conn = new PDO($dsn, $username, $password, $options);
        } catch (PDOException $e) {
            // Nunca ecoar detalhes da exceção (credenciais/host) na resposta
            error_log('[DATABASE_ERROR] ' . $e->getMessage());
            throw new Exception('Erro de conexão com o banco de dados');
        }

        return $this->conn;
    }

    /**
     * Executa query e retorna uma linha ou null
     */
    public function fetchOne($query, $params = []) {
        $stmt = $this->getConnection()->prepare($query);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Executa query e retorna todas as linhas
     */
    public function fetchAll($query, $params = []) {
        $stmt = $this->getConnection()->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Executa INSERT/UPDATE/DELETE
     */
    public function execute($query, $params = []) {
        $stmt = $this->getConnection()->prepare($query);
        return $stmt->execute($params);
    }

    /**
     * ID gerado pelo último INSERT
     */
    public function lastInsertId() {
        return $this->getConnection()->lastInsertId();
    }
}

/**
 * CORS com allowlist - chamada no topo dos endpoints públicos
 */
function setCorsHeaders() {
    $allowedOrigins = [
        'https://seudominio.com.br',
        'http://localhost:5173',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Max-Age: 86400');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
