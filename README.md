# 💍 Site de Casamento — Letícia & Kiury

Site oficial do casamento Letícia & Kiury (`casamentokiuryeleticia.com.br`), hospedado na Hostinger.

---

## 1 · O Projeto

Aplicação web completa para o casamento: apresentação do casal, galeria de fotos, informações de hospedagem, confirmação de presença, lista de presentes com pagamento online e painel administrativo para os noivos gerenciarem tudo.

### Stack

- **Frontend:** React 19 + TypeScript + Vite, Tailwind CSS, React Router (SPA)
- **Backend:** PHP puro rodando no Apache da própria Hostinger (sem framework)
- **Banco:** MySQL da Hostinger (acessado via PDO)
- **Pagamentos:** Woovi/OpenPix (PIX) e Mercado Pago Checkout Transparente (cartão)

### Funcionalidades (páginas)

| Rota | O que faz |
|------|-----------|
| `/` | Home — apresentação do casal, contagem regressiva e navegação |
| `/galeria` | Galeria de fotos do casal |
| `/hospedagem` | Sugestões de hotéis próximos com fotos e informações |
| `/confirmar` | Confirmação de presença — abre mensagem pronta no WhatsApp dos noivos |
| `/presentes` | Lista de presentes vinda do banco (com cotas e categorias), carrinho de compras |
| `/pagamento` | Escolha do método: PIX ou cartão de crédito, com resumo do carrinho |
| `/pagamento-sucesso` `/-pendente` `/-falha` | Telas de resultado do pagamento |
| `/admin` | Painel administrativo protegido por login (área exclusiva dos noivos) |

### Painel administrativo (`/admin`)

- Login com usuário/senha validados **no servidor** (nunca no navegador)
- Listar, criar, editar e desativar presentes
- Definir preços, categorias e quantidade de cotas
- Upload e remoção de imagens dos presentes (salvas em `public_html/imagens-presentes/`)
- Vendas registradas ficam visíveis para os noivos

A rota `/admin` também exige sessão válida: qualquer acesso sem login é redirecionado para a home pela verificação `useAuthGuard` → `/api/auth/me.php`.

---

## 2 · Banco de Dados (Hostinger MySQL)

O banco roda no mesmo servidor da hospedagem (host `localhost` em produção), criado pelo hPanel em **Bancos de Dados → MySQL**.

### Arquivo de conexão

Todas as APIs PHP usam `api/config/database.php` (classe `Database`, PDO, charset `utf8mb4`). Este arquivo **contém credenciais reais e jamais vai ao git** — só existem no repositório os modelos `api/config/database.example.php` e `api/config/config.example.php`.

A classe detecta o ambiente automaticamente:

| Ambiente | Host | Como funciona |
|----------|------|---------------|
| Produção | `localhost:3306` | PHP e MySQL no mesmo servidor Hostinger |
| Local (dev) | `srvXXX.hstgr.io:3306` | Acesso remoto — exige liberar seu IP no hPanel (**Conexão de banco de dados remota**) |

Para ambiente local, o Vite também faz proxy de `/api` para o backend configurado em `vite.config.ts`.

### Tabelas

```
┌─────────────────────┐
│ presentes           │  Catálogo de presentes com cotas
│  id, nome, preco,   │
│  categoria,         │  categoria ENUM: eletros, casa, divertidos,
│  imagem_url,        │                utensilios, vales
│  cotas_totais,      │
│  cotas_disponiveis, │  Decrementadas a cada venda
│  cotas_vendidas,    │
│  status_cotas,      │  disponivel | poucas_cotas | esgotado
│  ativo              │  Presente desativado some da loja
└─────────────────────┘
          │ 1:N
┌─────────────────────┐
│ vendas              │  Um registro por item vendido
│  presente_id (FK)   │
│  quantidade,        │
│  preco_unitario,    │  Preço congelado no momento da compra
│  subtotal,          │
│  metodo_pagamento,  │  pix | cartao
│  payment_id,        │  txid Woovi ou id do pagamento MP
│                     │  UNIQUE — impede cobrança dupla (anti-replay)
│  created_at         │
└─────────────────────┘

┌─────────────────────┐
│ admin_users         │  Administradores do painel
│  username UNIQUE,   │
│  password_hash      │  bcrypt (password_hash/password_verify)
│  role, ativo,       │
│  last_login         │
└─────────────────────┘
┌─────────────────────┐
│ admin_login_logs    │  Auditoria de todas as tentativas de login
├─────────────────────┤
│ admin_sessions      │  Controle de sessões administrativas
└─────────────────────┘
```

### Scripts SQL (`database/`)

- `create_database.sql` — script único e consolidado de criação: todas as tabelas (incluindo `payment_id` em `vendas`), triggers, views e catálogo inicial de presentes. Executar uma única vez no phpMyAdmin de um banco novo.
- `create_admin.php` — utilitário CLI para criar novos usuários administradores:
  ```bash
  php database/create_admin.php <usuario>            # perfil admin
  php database/create_admin.php <usuario> --superadmin
  ```
  A senha é pedida oculta no terminal e validada (8+ caracteres, maiúscula, minúscula e número). Requer as credenciais de `api/config/database.php`.

### Autenticação dos administradores

- Login em `POST /api/auth/login.php`: valida contra `admin_users` e regenera o `session_id`
- Senhas armazenadas como hash bcrypt (`password_hash`/`password_verify`)
- Sessão PHP com cookie endurecido: `HttpOnly`, `SameSite=Lax`, `Secure` quando o request vem por HTTPS
- Timeout de 2 horas de inatividade
- Endpoints administrativos são protegidos pelo middleware `api/middleware/require-auth.php` (`setProtectedCors()` + `requireAdmin()`)
- Política de senha do `create_admin.php`: mínimo 8 caracteres com maiúscula, minúscula e número — **use uma senha longa e única**; este é o principal mecanismo de proteção do painel (não há lockout automático)

### Endpoints da API

Públicos (somente leitura):
`GET /api/presentes/list.php` (opcional `?categoria=`) · `categorias.php` · `status.php?id=` · `get-single.php?id=`

Protegidos (exigem sessão de admin):
`POST /api/presentes/create.php` · `update.php` · `delete.php` · `upload-image.php` · `delete-image.php` · `GET /api/vendas/list.php`

Autenticação:
`POST /api/auth/login.php` · `POST /api/auth/logout.php` · `GET /api/auth/me.php`

Pagamentos e vendas:
`POST /api/createPix.php` · `GET /api/checkPix.php` · `POST /api/processCardPayment.php` · `POST /api/vendas/create.php`

---

## 3 · Integrações de Pagamento

As credenciais dos provedores vivem **exclusivamente no servidor**, em `api/config/config.php` (Woovi + Mercado Pago). Nada de chave privada vai ao bundle JavaScript — a única chave pública exposta é `VITE_MERCADO_PAGO_PUBLIC_KEY`, injetada no build apenas para o formulário tokenizador do Mercado Pago funcionar.

### PIX — Woovi (antiga OpenPix)

1. O frontend envia carrinho, valor e descrição para `POST /api/createPix.php`
2. A API **valida os preços contra a fonte canônica server-side** (tabela `presentes` no banco — a mesma do painel admin e da loja) — o preço enviado pelo cliente nunca é confiado — e cria a cobrança em `https://api.woovi.com/api/v1/charge`, retornando o `brCode` (QR Code + copia-e-cola) e o `correlationID`
3. Após ~10s, o frontend consulta `GET /api/checkPix.php?txid=...` a cada 4s (até 30 min)
4. Com `status: COMPLETED`, o frontend chama `POST /api/vendas/create.php`; o backend **revalida a cobrança direto na API da Woovi** antes de gravar a venda, usando o txid como `payment_id`

### Cartão — Mercado Pago (Checkout Transparente)

1. O Card Payment Brick (`@mercadopago/sdk-react`) coleta e **tokeniza** os dados do cartão no navegador — o site nunca vê o número completo
2. O frontend envia token, parcelas, pagador e carrinho para `POST /api/processCardPayment.php`
3. A API valida preços server-side, gera `Idempotency-Key` e cria o pagamento em `https://api.mercadopago.com/v1/payments` com o access token privado
4. Resultado: `approved` → sucesso · `pending`/`in_process` → pendente · erro → mensagem tratada no modal (recusas, cartões inválidos etc.)
5. No `approved`, o frontend registra a venda; o backend consulta o pagamento real em `/v1/payments/{id}` antes de persistir, guardando o id como `payment_id`

### Registro e integridade das vendas

`POST /api/vendas/create.php` é a única porta de entrada de vendas e aplica:

- Validação estrita de itens: quantidade inteira entre 1 e 10, estoque disponível, carrinho não vazio (`400`/`422`)
- Verificação do pagamento junto ao provedor **antes** de gravar (`402` se não aprovado)
- Conferência do valor pago no provedor contra o total dos itens com preços do banco (`422` se divergir)
- Anti-replay: `payment_id` único — a mesma cobrança não registra duas vendas (`409`)

Existe também `api/vendas/webhook.php`, receptor de notificações de pagamento do Mercado Pago/Woovi — útil como confirmação assíncrona adicional caso os webhooks sejam configurados nos painéis dos provedores.

---

## 4 · Estrutura na Hostinger (Gerenciador de Arquivos)

Tudo vive dentro de `public_html/` do domínio `casamentokiuryeleticia.com.br`:

```
public_html/
├── index.html                 # SPA gerada pelo build (npm run build → dist/)
├── assets/                    # JS/CSS/imagens com hash no nome
├── .htaccess                  # Rewrite SPA + headers de segurança + cache
│
├── imagens-presentes/         # Imagens enviadas pelo painel admin
│   └── .htaccess              # Cache longo (1 ano, immutable)
│
└── api/
    ├── .htaccess              # Bloqueia listagem de diretórios
    ├── createPix.php          # Cria cobrança PIX na Woovi (valida preços no banco)
    ├── checkPix.php           # Consulta status da cobrança
    ├── processCardPayment.php # Processa pagamento de cartão no MP (valida preços no banco)
    │
    ├── config/
    │   ├── config.php         # ⚠️ Chaves Woovi/Mercado Pago (nunca versionado)
    │   └── database.php       # ⚠️ Credenciais MySQL reais (nunca versionado)
    │
    ├── middleware/
    │   └── require-auth.php   # setProtectedCors() + requireAdmin()
    │
    ├── auth/
    │   ├── login.php          # Login (valida bcrypt, regenera session id)
    │   ├── logout.php         # Destrói a sessão
    │   └── me.php             # Verifica sessão ativa
    │
    ├── presentes/
    │   ├── list.php           # Público: lista/filtra presentes
    │   ├── categorias.php     # Público: estatísticas por categoria
    │   ├── status.php         # Público: cotas de um presente
    │   ├── get-single.php     # Público: detalhe de um presente
    │   ├── create.php         # 🔒 Admin: cria presente
    │   ├── update.php         # 🔒 Admin: edita presente
    │   ├── delete.php         # 🔒 Admin: desativa/remove presente
    │   ├── upload-image.php   # 🔒 Admin: upload de imagem
    │   └── delete-image.php   # 🔒 Admin: remove imagem
    │
    └── vendas/
        ├── create.php         # Registra venda (valida pagamento no provedor)
        ├── list.php           # 🔒 Admin: lista vendas realizadas
        └── webhook.php        # Receiver de webhooks MP/Woovi
```

> 🔒 = protegido por sessão de administrador. Os arquivos `*.example.php` e suítes de teste existem só no repositório de desenvolvimento — não precisam (nem devem) ir ao servidor.

### Deploy em resumo

1. `npm run build` → sobe todo o conteúdo de `dist/` para `public_html/`
2. Sobrepor a pasta `api/` completa
3. Conferir que `api/config/config.php` e `api/config/database.php` contêm as credenciais reais no servidor
4. HTTPS obrigatório (SSL gratuito Let's Encrypt pelo hPanel) — exigido pelo Brick do Mercado Pago, clipboard API e cookies seguros

### Papel dos `.htaccess`

- **Raiz:** rewrite de todas as rotas para `index.html` (SPA Router), headers de segurança (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), compressão deflate, cache de estáticos, bloqueio de arquivos sensíveis (`.md`, `.sql`, `.env`, `.log`…) e `Options -Indexes`
- **`api/.htaccess`:** bloqueia listagem de diretórios na pasta da API
- **`imagens-presentes/.htaccess`:** cache imutável de 1 ano para as imagens dos presentes

### CORS

Allowlist rígido: apenas `https://casamentokiuryeleticia.com.br` e `http://localhost:5173` (desenvolvimento). Origens desconhecidas não recebem headers CORS; endpoints autenticados usam o helper `setProtectedCors()` com `OPTIONS → 204`.

---

*Desenvolvido pelo noivo Kiury Mariano durante 2026.* 💙
