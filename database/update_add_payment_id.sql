-- ============================================
-- Adiciona coluna payment_id na tabela vendas
-- Permite auditoria (qual pagamento gerou a venda)
-- e bloqueio de replay (mesmo pagamento = 1 venda)
--
-- Execute UMA VEZ no phpMyAdmin da Hostinger:
-- hPanel → Bancos de Dados MySQL → phpMyAdmin → aba SQL
-- ============================================

ALTER TABLE vendas
    ADD COLUMN payment_id VARCHAR(255) NULL DEFAULT NULL AFTER metodo_pagamento,
    ADD INDEX idx_payment_id (payment_id);
