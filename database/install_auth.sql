-- ============================================
-- Script de Instalação - Sistema de Autenticação
-- ============================================
-- Casamento Letícia & Kiury - Autenticação Admin
--
-- Instruções:
-- 1. Faça backup do banco antes de executar
-- 2. Execute via phpMyAdmin ou linha de comando
-- 3. Após executar, altere a senha padrão IMEDIATAMENTE
-- ============================================

-- ============================================
-- 1. Criar tabela de administradores
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    login_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    locked_until TIMESTAMP NULL,

    PRIMARY KEY (id),
    UNIQUE KEY idx_username (username),
    INDEX idx_ativo (ativo),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuários administrativos do sistema';

-- ============================================
-- 2. Inserir administrador padrão
-- ============================================
-- SENHA PADRÃO: leticiaekiury2027
-- ⚠️ ALTERAR APÓS PRIMEIRO LOGIN
--
-- Hash gerado com: password_hash('leticiaekiury2027', PASSWORD_DEFAULT)
-- Para gerar nova senha: php api/auth/generate-password-hash.php

INSERT INTO admin_users (
    username,
    password_hash,
    role,
    ativo
) VALUES (
    'admin',
    '$2y$12$L8dA0xv3YP35QlQr3CBAwuRxiP66xvPUUKa5IgR3IfhrXd88MUZyO',
    'admin',
    1
) ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    ativo = 1;

-- ============================================
-- 3. Criar tabela de tentativas de login (opcional - para rate limiting)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_login_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_id INT UNSIGNED NULL,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    success TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_ip (ip_address),
    INDEX idx_created_at (created_at),
    INDEX idx_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Logs de tentativas de login administrativo';

-- ============================================
-- 4. Criar tabela de sessões ativas (opcional)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_id INT UNSIGNED NOT NULL,
    session_id VARCHAR(128) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    UNIQUE KEY idx_session_id (session_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sessões administrativas ativas';

-- ============================================
-- 5. Views úteis (opcional)
-- ============================================

-- View: Administradores ativos
CREATE OR REPLACE VIEW vw_admin_users_active AS
SELECT
    id,
    username,
    role,
    created_at,
    last_login,
    TIMESTAMPDIFF(MINUTE, last_login, NOW()) AS minutes_since_login
FROM admin_users
WHERE ativo = 1;

-- View: Tentativas de login recentes (últimas 24h)
CREATE OR REPLACE VIEW vw_recent_login_attempts AS
SELECT
    username,
    COUNT(*) AS attempts,
    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successful_logins,
    SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed_logins
FROM admin_login_logs
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY username;

-- ============================================
-- 6. Verificação da instalação
-- ============================================

SELECT
    'Instalação concluída!' AS mensagem,
    (SELECT COUNT(*) FROM admin_users) AS total_admins,
    (SELECT COUNT(*) FROM admin_users WHERE ativo = 1) AS admins_ativos,
    (SELECT username FROM admin_users WHERE username = 'admin') AS admin_criado;

-- ============================================
-- 7. Comandos úteis (comentados - execute conforme necessário)
-- ============================================

-- Para alterar senha do admin:
-- UPDATE admin_users
-- SET password_hash = '$2y$12$NOVO_HASH_AQUI'
-- WHERE username = 'admin';

-- Para desativar um admin:
-- UPDATE admin_users SET ativo = 0 WHERE username = 'admin';

-- Para resetar tentativas de login:
-- UPDATE admin_users SET login_attempts = 0, locked_until = NULL WHERE username = 'admin';

-- Para limpar logs antigos (mais de 30 dias):
-- DELETE FROM admin_login_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Para limpar sessões expiradas:
-- DELETE FROM admin_sessions WHERE expires_at < NOW();

-- ============================================
-- FIM DO SCRIPT
-- ============================================
