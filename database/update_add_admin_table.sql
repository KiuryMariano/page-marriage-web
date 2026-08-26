-- ============================================
-- Adicionar tabela de administradores
-- ============================================
-- Execute este script via phpMyAdmin
-- ============================================

-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY idx_username (username),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir admin padrão
-- Senha: leticiaekiury2027 ⚠️ ALTERAR APÓS PRIMEIRO LOGIN
-- Hash gerado com password_hash('leticiaekiury2027', PASSWORD_DEFAULT)
-- ⚠️ IMPORTANTE: Execute php api/auth/generate-password-hash.php para gerar nova senha
INSERT INTO admin_users (username, password_hash, role, ativo)
VALUES (
    'admin',
    '$2y$12$L8dA0xv3YP35QlQr3CBAwuRxiP66xvPUUKa5IgR3IfhrXd88MUZyO',
    'admin',
    1
)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
