-- ============================================
-- Atualizar imagens dos presentes (CORREÇÃO)
-- Mapeamento baseado no NOME do presente
-- ============================================

-- Eletros
UPDATE presentes SET imagem_url = '/assets/gifts/5-geladeira.webp' WHERE nome = 'Geladeira';
UPDATE presentes SET imagem_url = '/assets/gifts/6-microondas.webp' WHERE nome = 'Microondas';
UPDATE presentes SET imagem_url = '/assets/gifts/7-cafeteira.webp' WHERE nome = 'Cafeteira';
UPDATE presentes SET imagem_url = '/assets/gifts/8-pipoqueira.webp' WHERE nome = 'Pipoqueira elétrica';
UPDATE presentes SET imagem_url = '/assets/gifts/9-chaleira.webp' WHERE nome = 'Chaleira Elétrica';
UPDATE presentes SET imagem_url = '/assets/gifts/21-fogao.webp' WHERE nome = 'Fogão 6 bocas (para cozinhar os jantares românticos)';
UPDATE presentes SET imagem_url = '/assets/gifts/24-sanduicheira.webp' WHERE nome = 'Sanduicheira/Grill Elétrica';

-- Casa
UPDATE presentes SET imagem_url = '/assets/gifts/2-coberta-noiva.webp' WHERE nome = 'Coberta para Noiva (sempre coberta de razão)';
UPDATE presentes SET imagem_url = '/assets/gifts/3-ps5-noivo.webp' WHERE nome = 'PS5 para o Noivo';
UPDATE presentes SET imagem_url = '/assets/gifts/1-cota-festa.webp' WHERE nome = 'Cota da Festa de Casamento';
UPDATE presentes SET imagem_url = '/assets/gifts/19-sal-grosso.webp' WHERE nome = 'Sal Grosso (espantar mau-olhado)';

-- Divertidos
UPDATE presentes SET imagem_url = '/assets/gifts/15-calmante.webp' WHERE nome = 'Calmante para o Noivo (após ver a conta do casamento)';
UPDATE presentes SET imagem_url = '/assets/gifts/16-mascaras-gas.webp' WHERE nome = 'Máscaras de Gás (Para trocar as fraldas dos futuros filhos)';

-- Utensílios
UPDATE presentes SET imagem_url = '/assets/gifts/4-kit-turbo.webp' WHERE nome = 'Cota do Kit Turbo de padaria';
UPDATE presentes SET imagem_url = '/assets/gifts/22-panelas.webp' WHERE nome = 'Jogo completo de panelas';
UPDATE presentes SET imagem_url = '/assets/gifts/23-colorex.webp' WHERE nome = 'Jogo completo Colorex';
UPDATE presentes SET imagem_url = '/assets/gifts/18-avental.webp' WHERE nome = 'Avental pro Noivo aprender a cozinhar';
UPDATE presentes SET imagem_url = '/assets/gifts/20-rolo-macarrao.webp' WHERE nome = 'Rolo de Macarrão (para quando a Noiva achar necessário)';

-- Vales
UPDATE presentes SET imagem_url = '/assets/gifts/10-vestido-noiva.webp' WHERE nome = 'Cota do Vestido da Noiva';
UPDATE presentes SET imagem_url = '/assets/gifts/12-dia-noiva.webp' WHERE nome = 'Dia da Noiva';
UPDATE presentes SET imagem_url = '/assets/gifts/14-spa.webp' WHERE nome = 'Vale SPA para \'Paz Pós-Briga\'';
UPDATE presentes SET imagem_url = '/assets/gifts/13-fundo-emergencial.webp' WHERE nome = 'Fundo Emergencial para TPM';
UPDATE presentes SET imagem_url = '/assets/gifts/11-corte-cabelo.webp' WHERE nome = 'Corte de Cabelo do Noivo';
UPDATE presentes SET imagem_url = '/assets/gifts/17-academia.webp' WHERE nome = 'Academia (recuperação pós-buffet do casamento)';

-- ============================================
-- Verificação
-- ============================================
SELECT id, nome, imagem_url FROM presentes WHERE imagem_url IS NOT NULL ORDER BY id;
