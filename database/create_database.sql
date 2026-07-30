-- ============================================
-- Banco de Dados: Casamento Letícia & Kiury
-- Módulo: Presentes
-- ============================================
-- Instruções:
-- 1. CREATE DATABASE casamento_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. USE casamento_db;
-- 3. Execute este script
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Garantir auto-incremento de 1 em 1
SET @@auto_increment_increment=1;
SET @@auto_increment_offset=1;

-- ============================================
-- 1. TABELA: presentes
-- ============================================
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

-- ============================================
-- 2. TABELA: vendas
-- ============================================
CREATE TABLE IF NOT EXISTS vendas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    presente_id INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    metodo_pagamento ENUM('pix', 'cartao') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (presente_id) REFERENCES presentes(id) ON DELETE RESTRICT,
    INDEX idx_presente (presente_id),
    INDEX idx_data (created_at)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT: Presentes iniciais
-- ============================================
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

-- ============================================
-- VIEW: Presentes com status
-- ============================================
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

-- ============================================
-- VIEW: Presentes por categoria
-- ============================================
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

-- ============================================
-- TRIGGER: Diminuir cotas ao registrar venda
-- ============================================
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
