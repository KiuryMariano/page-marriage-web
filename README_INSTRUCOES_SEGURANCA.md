# 📋 Instruções de Deploy e Teste - Correções de Segurança

## 🎯 Resumo das Alterações

### ✅ Implementado (P0 - Críticas)

#### 1. Sistema de Autenticação Server-Side
- ✅ Criado `/api/auth/login.php` - Login com validação server-side
- ✅ Criado `/api/auth/logout.php` - Logout com destruição de sessão
- ✅ Criado `/api/auth/me.php` - Verificação de sessão
- ✅ Criado `/api/middleware/require-auth.php` - Middleware de proteção

#### 2. Proteção de Endpoints Administrativos
- ✅ `/api/presentes/create.php` - Protegido com middleware
- ✅ `/api/presentes/update.php` - Protegido com middleware
- ✅ `/api/presentes/delete.php` - Protegido com middleware
- ✅ `/api/presentes/upload-image.php` - Protegido + CORS removido
- ✅ `/api/presentes/delete-image.php` - Protegido + CORS removido

#### 3. Remoção de Credenciais do Frontend
- ✅ `src/hooks/useAuth.ts` - Credenciais removidas
- ✅ Migrado para autenticação via API com cookies de sessão

### ✅ Implementado (P1 - Alta Prioridade)

#### 4. Validação de Pagamento
- ✅ Criado `/api/vendas/webhook.php` - Webhook para notificações
- ✅ Criado `/api/vendas/validate-payment.php` - Validação de pagamento

#### 5. Validação de Quantity
- ✅ `/api/vendas/create.php` - Validação rigorosa implementada

#### 6. CORS Corrigido
- ✅ Removido `Access-Control-Allow-Origin: *`
- ✅ Implementado allowlist estrito

### ✅ Implementado (P2 - Média Prioridade)

#### 7. Headers de Segurança
- ✅ HSTS implementado
- ✅ CSP completo implementado
- ✅ X-Content-Type-Options implementado
- ✅ Referrer-Policy implementado
- ✅ Permissions-Policy implementado

#### 8. Redução de Fingerprinting
- ✅ Headers X-Powered-By e Server removidos
- ✅ ServerSignature desabilitado

---

## 🚀 Instruções de Deploy

### Passo 1: Banco de Dados

Execute o SQL abaixo via phpMyAdmin:

```bash
# Criar tabela de administradores
mysql -u USUARIO -p DATABASE < database/update_add_admin_table.sql
```

Ou execute manualmente no phpMyAdmin:

1. Abra o phpMyAdmin
2. Selecione seu banco de dados
3. Clique na aba "SQL"
4. Cole e execute o conteúdo de `database/update_add_admin_table.sql`

### Passo 2: Gerar Nova Senha

⚠️ **IMPORTANTE**: A senha padrão será alterada após primeiro login

Execute no servidor:

```bash
php api/auth/generate-password-hash.php
```

Digite a nova senha forte e copie o hash gerado.

### Passo 3: Atualizar Arquivos

Faça upload dos seguintes arquivos novos/alterados:

**Novos Arquivos:**
```
api/auth/login.php
api/auth/logout.php
api/auth/me.php
api/auth/generate-password-hash.php
api/middleware/require-auth.php
api/vendas/webhook.php
api/vendas/validate-payment.php
database/update_add_admin_table.sql
```

**Arquivos Alterados:**
```
api/presentes/create.php
api/presentes/update.php
api/presentes/delete.php
api/presentes/upload-image.php
api/presentes/delete-image.php
api/vendas/create.php
src/hooks/useAuth.ts
.htaccess
```

### Passo 4: Configurar Webhooks

Configure os webhooks nas plataformas:

**Mercado Pago:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Selecione sua aplicação
3. Vá em "Webhooks"
4. Adicione URL: `https://casamentokiuryeleticia.com.br/api/vendas/webhook.php?topic=payment`

**Woovi/OpenPix:**
1. Acesse o painel da Woovi
2. Configure webhook para: `https://casamentokiuryeleticia.com.br/api/vendas/webhook.php`

### Passo 5: Build do Frontend

```bash
npm run build
```

Faça upload do conteúdo de `dist/` para o servidor.

---

## 🧪 Checklist de Teste

### Autenticação

- [ ] **Bundle JS sem credenciais**
  - Abra `dist/assets/index-*.js` e procure por "leticiaekiury2027"
  - Não deve encontrar

- [ ] **Login server-side funciona**
  - Tente acessar `/admin`
  - Será redirecionado para login
  - Faça login com `admin` / `leticiaekiury2027`
  - Deve funcionar

- [ ] **Alterar localStorage não concede acesso**
  ```javascript
  localStorage.setItem("marriage_auth", "true");
  location.reload();
  ```
  - Não deve acessar /admin (servidor verifica sessão)

- [ ] **Logout invalida sessão**
  - Faça logout
  - Tente acessar `/api/presentes/create.php`
  - Deve retornar 401

### Autorização (Endpoints)

- [ ] **create.php → 401 sem sessão**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/presentes/create.php \
    -H "Content-Type: application/json" \
    -d '{"nome":"Teste","preco":10,"categoria":"casa"}'
  ```
  - Esperado: `{"success":false,"error":"Autenticação necessérica"}`

- [ ] **update.php → 401 sem sessão**
  ```bash
  curl -X PUT https://casamentokiuryeleticia.com.br/api/presentes/update.php \
    -H "Content-Type: application/json" \
    -d '{"id":1,"nome":"Teste"}'
  ```
  - Esperado: 401

- [ ] **delete.php → 401 sem sessão**
  ```bash
  curl -X DELETE https://casamentokiuryeleticia.com.br/api/presentes/delete.php?id=1
  ```
  - Esperado: 401

- [ ] **upload-image.php → 401 sem sessão**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/presentes/upload-image.php \
    -F "imagem=@test.jpg"
  ```
  - Esperado: 401

- [ ] **delete-image.php → 401 sem sessão**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/presentes/delete-image.php \
    -H "Content-Type: application/json" \
    -d '{"image_url":"/imagens-presentes/test.jpg"}'
  ```
  - Esperado: 401

### Vendas (Validação de Quantity)

- [ ] **quantity = 0 → 422**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":0}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 422

- [ ] **quantity = -1 → 422**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":-1}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 422

- [ ] **quantity = 0.5 → 422**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":0.5}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 422

- [ ] **quantity = "banana" → 422**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":"banana"}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 422

- [ ] **quantity > 10 → 422**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":11}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 422

- [ ] **Carrinho vazio → 400**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 400

- [ ] **Venda válida → 201**
  ```bash
  curl -X POST https://casamentokiuryeleticia.com.br/api/vendas/create.php \
    -H "Content-Type: application/json" \
    -d '{"itens":[{"id":1,"quantity":1}],"metodo_pagamento":"pix"}'
  ```
  - Esperado: 201

### CORS

- [ ] **Origem arbitrária não recebe ACAO**
  ```bash
  curl -X OPTIONS https://casamentokiuryeleticia.com.br/api/presentes/upload-image.php \
    -H "Origin: https://evil.com" \
    -H "Access-Control-Request-Method: POST" \
    -v
  ```
  - Esperado: Sem `Access-Control-Allow-Origin`

- [ ] **Origem autorizada recebe ACAO**
  ```bash
  curl -X OPTIONS https://casamentokiuryeleticia.com.br/api/presentes/upload-image.php \
    -H "Origin: https://casamentokiuryeleticia.com.br" \
    -H "Access-Control-Request-Method: POST" \
    -v
  ```
  - Esperado: `Access-Control-Allow-Origin: https://casamentokiuryeleticia.com.br`

- [ ] **OPTIONS retorna 204**
  - Esperado: Status 204 No Content

### Segurança HTTP

- [ ] **HSTS ativo**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: `Strict-Transport-Security: max-age=31536000`

- [ ] **CSP completa**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: `Content-Security-Policy: default-src 'self'; ...`

- [ ] **nosniff presente**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: `X-Content-Type-Options: nosniff`

- [ ] **Referrer-Policy presente**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: `Referrer-Policy: strict-origin-when-cross-origin`

- [ ] **Permissions-Policy presente**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: `Permissions-Policy: geolocation=(), ...`

- [ ] **X-Powered-By ausente**
  ```bash
  curl -I https://casamentokiuryeleticia.com.br
  ```
  - Esperado: Sem `X-Powered-By`

---

## ⚠️ Notas Importantes

### Troca de Senha Obrigatória

A senha padrão `leticiaekiury2027` deve ser alterada IMEDIATAMENTE após o primeiro login.

### Webhooks de Pagamento

A implementação atual de webhooks está pronta mas requer configuração nas plataformas (Mercado Pago e Woovi).

### Logs

Os arquivos de autenticação e webhooks registram erros no error_log do PHP. Verifique os logs se houver problemas:

```bash
tail -f /path/to/error_log
```

---

## 📞 Suporte

Em caso de problemas, verifique:
1. Os logs do PHP
2. A configuração do banco de dados
3. As permissões dos arquivos
4. A configuração do HTTPS no servidor

---

## ✅ Definição de Pronto

A implementação está completa quando:
- ✅ Nenhuma vulnerabilidade crítica (WEB-01, WEB-02, WEB-03) permanece explorável
- ✅ Todos os endpoints administrativos exigem autenticação server-side
- ✅ O frontend não contém credenciais
- ✅ A validação de quantity está rigorosa
- ✅ CORS está restrito a origens autorizadas
- ✅ Todos os headers de segurança estão presentes
- ✅ O checklist de reteste passa integralmente
