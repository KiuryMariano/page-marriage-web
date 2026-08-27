-- ============================================================
-- Banco de Dados: Casamento Letícia & Kiury
-- Script único de criação — versão final consolidada
-- ============================================================
-- Inclui todas as tabelas em sua forma atual:
--   presentes, vendas (com payment_id anti-replay),
--   admin_users, admin_login_logs, admin_sessions,
--   triggers e views.
--
-- Como executar (Hostinger):
--   1. hPanel → Bancos de Dados MySQL → crie o banco e anote as credenciais
--   2. Abra o phpMyAdmin do banco criado
--   3. Aba "SQL" → cole este script → Executar
--
-- O script é idempotente: pode ser executado novamente sem erro
-- (CREATE IF NOT EXISTS / DROP+CREATE nas views). ATENÇÃO: ele NÃO
-- apaga tabelas existentes — use apenas em banco novo ou vazio.
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Garantir auto-incremento de 1 em 1
SET @@auto_increment_increment = 1;
SET @@auto_increment_offset = 1;

-- ============================================================
-- 1. TABELA: presentes
-- ============================================================
CREATE TABLE IF NOT EXISTS presentes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(512) DEFAULT NULL,
    categoria ENUM('eletros', 'casa', 'divertidos', 'utensilios', 'vales') NOT NULL DEFAULT 'casa',
    cotas_totais INT UNSIGNED NOT NULL DEFAULT 1,
    cotas_disponiveis INT UNSIGNED NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_ativo (ativo),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. TABELA: vendas
--     payment_id: identificador da cobrança no provedor
--     (txid da Woovi para PIX, id do pagamento no Mercado Pago
--     para cartão). UNIQUE impede que a mesma cobrança registre
--     duas vendas (anti-replay).
-- ============================================================
CREATE TABLE IF NOT EXISTS vendas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    presente_id INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    metodo_pagamento ENUM('pix', 'cartao') NOT NULL,
    payment_id VARCHAR(255) NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payment_id (payment_id),
    FOREIGN KEY (presente_id) REFERENCES presentes(id) ON DELETE RESTRICT,
    INDEX idx_presente (presente_id),
    INDEX idx_data (created_at)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. TABELA: admin_users
--     Administradores do painel /admin.
--     Senhas em bcrypt (password_hash / password_verify).
--     login_attempts + locked_until = bloqueio após falhas seguidas.
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY idx_username (username),
    INDEX idx_ativo (ativo),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuários administrativos do sistema';

-- ============================================================
-- 4. TABELA: admin_login_logs
--     Auditoria de todas as tentativas de login administrativo.
-- ============================================================
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

-- ============================================================
-- 5. TABELA: admin_sessions
--     Sessões administrativas ativas (controle de múltiplos logins).
-- ============================================================
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

-- ============================================================
-- 6. TRIGGER: decrementar cotas ao registrar venda
-- ============================================================
DROP TRIGGER IF EXISTS trg_diminuir_cotas_venda;

DELIMITER $$

CREATE TRIGGER trg_diminuir_cotas_venda
AFTER INSERT ON vendas
FOR EACH ROW
BEGIN
    UPDATE presentes
    SET cotas_disponiveis = GREATEST(0, cotas_disponiveis - NEW.quantidade)
    WHERE id = NEW.presente_id;
END$$

DELIMITER ;

-- ============================================================
-- 7. VIEWS de consulta
-- ============================================================

-- Presentes com status calculado das cotas
CREATE OR REPLACE VIEW vw_presentes_status AS
SELECT
    p.id,
    p.nome,
    p.preco,
    p.categoria,
    p.cotas_totais,
    p.cotas_disponiveis,
    (p.cotas_totais - p.cotas_disponiveis) AS cotas_vendidas,
    ROUND(((p.cotas_totais - p.cotas_disponiveis) / p.cotas_totais) * 100, 1) AS porcentaje_vendido,
    CASE
        WHEN p.cotas_disponiveis = 0 THEN 'esgotado'
        WHEN p.cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
        ELSE 'disponivel'
    END AS status_cotas,
    p.ativo
FROM presentes p;

-- Estatísticas por categoria (somente presentes ativos)
CREATE OR REPLACE VIEW vw_presentes_por_categoria AS
SELECT
    categoria,
    COUNT(*) AS total_presentes,
    SUM(cotas_totais) AS total_cotas_geral,
    SUM(cotas_disponiveis) AS total_cotas_disponiveis,
    SUM(cotas_totais - cotas_disponiveis) AS total_cotas_vendidas,
    ROUND(AVG(preco), 2) AS preco_medio
FROM presentes
WHERE ativo = 1
GROUP BY categoria;

-- ============================================================
-- 8. INSERT: catálogo inicial de presentes
--     Preços devem permanecer sincronizados com api/gifts_data.php
-- ============================================================
INSERT INTO presentes (nome, preco, categoria, cotas_totais, cotas_disponiveis, ativo) VALUES
-- Eletros (7 itens)
('Geladeira', 1599.00, 'eletros', 2, 2, 1),
('Microondas', 295.00, 'eletros', 1, 1, 1),
('Cafeteira', 150.00, 'eletros', 1, 1, 1),
('Pipoqueira elétrica', 50.00, 'eletros', 1, 1, 1),
('Chaleira Elétrica', 60.00, 'eletros', 1, 1, 1),
('Fogão 6 bocas (para cozinhar os jantares românticos)', 799.00, 'eletros', 1, 1, 1),
('Sanduicheira/Grill Elétrica', 99.00, 'eletros', 1, 1, 1),

-- Casa (4 itens)
('Coberta para Noiva (sempre coberta de razão)', 250.00, 'casa', 1, 1, 1),
('PS5 para o Noivo', 1499.00, 'casa', 2, 2, 1),
('Cota da Festa de Casamento', 3.00, 'casa', 20, 20, 1),
('Sal Grosso (espantar mau-olhado)', 9.99, 'casa', 100, 100, 1),

-- Divertidos (2 itens)
('Calmante para o Noivo (após ver a conta do casamento)', 50.00, 'divertidos', 5, 5, 1),
('Máscaras de Gás (Para trocar as fraldas dos futuros filhos)', 30.00, 'divertidos', 5, 5, 1),

-- Utensílios (5 itens)
('Cota do Kit Turbo de padaria', 300.00, 'utensilios', 10, 10, 1),
('Jogo completo de panelas', 395.00, 'utensilios', 1, 1, 1),
('Jogo completo Colorex', 650.00, 'utensilios', 1, 1, 1),
('Avental pro Noivo aprender a cozinhar', 40.00, 'utensilios', 1, 1, 1),
('Rolo de Macarrão (para quando a Noiva achar necessário)', 20.00, 'utensilios', 1, 1, 1),

-- Vales (6 itens)
('Cota do Vestido da Noiva', 400.00, 'vales', 10, 10, 1),
('Dia da Noiva', 200.00, 'vales', 5, 5, 1),
('Vale SPA para ''Paz Pós-Briga''', 300.00, 'vales', 2, 2, 1),
('Fundo Emergencial para TPM', 100.00, 'vales', 10, 10, 1),
('Corte de Cabelo do Noivo', 35.00, 'vales', 1, 1, 1),
('Academia (recuperação pós-buffet do casamento)', 120.00, 'vales', 5, 5, 1);

-- ============================================================
-- 9. Verificação da instalação
-- ============================================================
SELECT 'Banco de dados criado com sucesso!' AS mensagem,
       (SELECT COUNT(*) FROM presentes) AS total_presentes,
       (SELECT COUNT(*) FROM vendas) AS total_vendas,
       (SELECT COUNT(*) FROM admin_users) AS total_admins;
