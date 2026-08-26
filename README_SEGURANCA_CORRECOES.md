
# README — Plano de Correção de Segurança (Casamento K&L)

> Documento derivado do relatório de teste de segurança da aplicação `casamentokiuryeleticia.com.br`.
>
> **Objetivo:** servir como guia de implementação para um agente de código corrigir todas as vulnerabilidades identificadas.

---

# Status Geral

| ID | Vulnerabilidade | Severidade | Status |
|----|-----------------|------------|--------|
| WEB-01 | Credenciais administrativas expostas no frontend | 🔴 Crítica | Confirmada |
| WEB-02 | Autenticação feita apenas via `localStorage` | 🔴 Crítica | Confirmada |
| WEB-03 | Endpoints administrativos sem autenticação | 🔴 Crítica | Confirmada |
| WEB-04 | CORS permissivo em upload/delete de imagens | 🟠 Alta | Confirmada |
| WEB-05 | Validação incorreta de `quantity` nas vendas | 🟡 Média | Confirmada |
| WEB-06 | Headers de segurança incompletos (HSTS/CSP/etc.) | 🔵 Baixa | Confirmada |
| WEB-07 | Exposição de fingerprint tecnológico | ⚪ Informativa | Confirmada |
| OBS-01 | Integridade do pagamento deve ser validada no backend | 🟣 Revisão | Não conclusiva |

---

# Ordem de Implementação (Prioridade)

## P0 — Corrigir imediatamente

- [ ] Remover credenciais do frontend.
- [ ] Trocar a senha administrativa atual.
- [ ] Implementar autenticação server-side.
- [ ] Proteger todos os endpoints administrativos com middleware de autenticação/autorização.

## P1 — Próximas 24–48 horas

- [ ] Validar pagamento no backend antes de criar vendas.
- [ ] Corrigir validação de `quantity`.
- [ ] Remover `Access-Control-Allow-Origin: *` dos endpoints administrativos.

## P2 — Até 7 dias

- [ ] Adicionar HSTS.
- [ ] Implementar CSP completa.
- [ ] Adicionar demais headers HTTP de segurança.

## P3 — Até 30 dias

- [ ] Reduzir fingerprinting do servidor.
- [ ] Padronizar respostas HTTP.

---

# WEB-01 — Remover credenciais do frontend

## Problema

O bundle JavaScript publicado contém usuário e senha administrativa.

### O que remover

Qualquer código semelhante a:

```javascript
const ADMIN = {
  username: "...",
  password: "..."
}
```

ou qualquer comparação direta no React.

## Implementação esperada

### Backend

- Criar autenticação em PHP.
- Salvar senha usando `password_hash()`.
- Validar login usando `password_verify()`.

### Frontend

- Nunca possuir usuário/senha embutidos.
- Apenas enviar credenciais para `/api/auth/login.php`.

## Critérios de aceite

- Nenhuma credencial presente no bundle JS.
- Senha antiga revogada.
- Login depende exclusivamente do servidor.

---

# WEB-02 — Autenticação server-side

## Problema

A aplicação autentica utilizando:

- `marriage_auth`
- `marriage_auth_timestamp`

armazenados no `localStorage`.

Isso permite acesso ao painel alterando o `localStorage`.

## Implementação

### Criar sessão PHP

Fluxo esperado:

```text
POST /api/auth/login.php
        ↓
Valida usuário/senha
        ↓
session_start()
$_SESSION["admin"] = true
        ↓
Cookie HttpOnly + Secure + SameSite
```

### Criar endpoints

```
/api/auth/login.php
/api/auth/logout.php
/api/auth/me.php
```

### Criar middleware

```
/api/middleware/require-auth.php
```

Responsabilidade:

- iniciar sessão;
- verificar autenticação;
- retornar 401 caso não autenticado.

### Logout

- destruir sessão.
- regenerar ID de sessão no login.

## Critérios de aceite

- `localStorage` não controla acesso.
- `/admin` consulta `/api/auth/me.php`.
- Sem sessão → 401.

---

# WEB-03 — Proteger endpoints administrativos

## Problema

Os endpoints administrativos aceitam chamadas anônimas.

## Endpoints que DEVEM exigir autenticação

```
/api/presentes/create.php
/api/presentes/update.php
/api/presentes/delete.php
/api/presentes/upload-image.php
/api/presentes/delete-image.php
```

## Implementação

Adicionar no topo de todos:

```php
require_once "../middleware/require-auth.php";
requireAdmin();
```

### Middleware deve

- verificar sessão;
- verificar role `admin`;
- retornar 401 ou 403 imediatamente.

Nenhuma lógica deve executar antes.

## Critérios de aceite

Sem sessão:

```
401 Unauthorized
```

Usuário comum:

```
403 Forbidden
```

Administrador:

```
200 OK
```

---

# WEB-04 — Corrigir política CORS

## Problema

Endpoints retornam:

```
Access-Control-Allow-Origin: *
```

## Implementação

### Mesmo domínio

Remover completamente CORS.

### Domínios autorizados

Criar allowlist.

Exemplo:

```php
$allowedOrigins = [
    "https://casamentokiuryeleticia.com.br"
];
```

### OPTIONS

Responder preflight separadamente.

```
204 No Content
```

Sem executar lógica de negócio.

## Critérios de aceite

Origem desconhecida:

- não recebe `Access-Control-Allow-Origin`.

---

# WEB-05 — Corrigir validação de quantidade

## Problema

O endpoint aceita:

- 0
- negativo
- decimal
- string

e retorna sucesso.

## Implementação

Validar:

- inteiro;
- maior que zero;
- limite de estoque.

### Regras

```text
quantity
├── inteiro
├── > 0
└── <= estoque disponível
```

### Retornos esperados

Entrada inválida:

```
422 Unprocessable Entity
```

Carrinho vazio:

```
400 Bad Request
```

Venda válida:

```
201 Created
```

## Critérios de aceite

Casos inválidos retornam erro.

Nunca retornar `success=true` sem venda persistida.

---

# WEB-06 — Adicionar headers de segurança

## Implementação

Adicionar headers HTTP.

### Obrigatórios

```http
Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

### CSP mínima

Definir:

- default-src
- script-src
- img-src
- style-src
- connect-src
- frame-ancestors
- base-uri
- object-src

## Critérios de aceite

Todos presentes nas respostas HTTPS.

---

# WEB-07 — Reduzir fingerprinting

## Problema

Servidor expõe:

- LiteSpeed
- PHP versão
- hPanel
- plataforma

## Implementação

### PHP

```
expose_php = Off
```

### Servidor

Remover headers desnecessários.

## Critérios de aceite

`X-Powered-By` ausente.

---

# OBS-01 — Validar pagamento no backend

## Objetivo

Nunca registrar venda confiando nos dados enviados pelo navegador.

## Fluxo esperado

```text
Frontend
    ↓
Cria intenção de pagamento
    ↓
Backend gera referência
    ↓
Mercado Pago / PIX
    ↓
Webhook confirma pagamento
    ↓
Backend valida pagamento
    ↓
Cria venda
    ↓
Baixa estoque
```

## Implementação

### PIX

- gerar `txid` no backend;
- consultar status do provedor.

### Cartão

Validar:

- payment_id;
- status;
- valor.

Tudo via API Mercado Pago.

### Nunca confiar em

- total;
- status;
- método de pagamento;
- itens enviados pelo frontend.

## Critérios de aceite

Venda apenas após confirmação server-side.

---

# Estrutura sugerida da API

```text
api/
├── auth/
│   ├── login.php
│   ├── logout.php
│   └── me.php
│
├── middleware/
│   └── require-auth.php
│
├── presentes/
│   ├── create.php
│   ├── update.php
│   ├── delete.php
│   ├── upload-image.php
│   └── delete-image.php
│
└── vendas/
    ├── create.php
    ├── webhook.php
    └── validate-payment.php
```

---

# Checklist de Reteste

## Autenticação

- [ ] Bundle JS sem credenciais.
- [ ] `/admin` exige sessão.
- [ ] Alterar `localStorage` não concede acesso.
- [ ] Logout invalida sessão.

## Autorização

- [ ] `create.php` → 401 sem sessão.
- [ ] `update.php` → 401 sem sessão.
- [ ] `delete.php` → 401 sem sessão.
- [ ] `upload-image.php` → 401 sem sessão.
- [ ] `delete-image.php` → 401 sem sessão.
- [ ] Usuário comum recebe 403.

## Vendas

- [ ] `quantity = 0` → 422.
- [ ] `quantity = -1` → 422.
- [ ] `quantity = 0.5` → 422.
- [ ] `quantity = "banana"` → 422.
- [ ] Carrinho vazio → 400.
- [ ] Venda válida → 201.

## Pagamentos

- [ ] Venda só existe após pagamento confirmado.
- [ ] PIX validado por `txid`.
- [ ] Cartão validado por `payment_id`.
- [ ] Estoque reduzido apenas após confirmação.

## CORS

- [ ] Origem arbitrária não recebe ACAO.
- [ ] OPTIONS retorna 204.

## Segurança HTTP

- [ ] HSTS ativo.
- [ ] CSP completa.
- [ ] `nosniff` presente.
- [ ] Referrer-Policy presente.
- [ ] Permissions-Policy presente.

## Exposição de arquivos

- [ ] `.env` continua inacessível.
- [ ] `.git` inacessível.
- [ ] Backups `.bak`, `.old`, `.txt`, `~`, `.phps` inacessíveis.
- [ ] `config.php` não expõe código.

---

# Resultado Esperado

Após todas as correções:

| Área | Resultado esperado |
|------|---------------------|
| Autenticação | 100% server-side via sessão/cookie. |
| Autorização | Todos os endpoints administrativos protegidos por middleware. |
| Credenciais | Nenhum segredo exposto ao frontend. |
| Pagamentos | Venda criada somente após validação do provedor. |
| Validação | Entradas inválidas retornam 400/422. |
| CORS | Apenas origens autorizadas possuem acesso. |
| Headers HTTP | HSTS, CSP e demais headers implementados. |
| Fingerprinting | Headers desnecessários removidos. |

---

## Definição de Pronto (Definition of Done)

A implementação é considerada concluída quando:

- Nenhuma vulnerabilidade crítica (WEB-01, WEB-02 e WEB-03) permanece explorável.
- Todos os endpoints administrativos exigem autenticação e autorização server-side.
- O frontend não contém credenciais nem lógica de segurança.
- O fluxo de vendas depende da confirmação de pagamento no backend.
- O checklist de reteste passa integralmente.
