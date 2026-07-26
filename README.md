# Site de casamento

Aplicação web para apresentar o casal, confirmar presença, exibir a galeria e receber presentes em dinheiro. O checkout permite pagamento por **PIX**, com cobrança e consulta de status pela Woovi (antiga OpenPix), e por **cartão**, com redirecionamento seguro para o Mercado Pago.

## Tecnologias

- React 19, TypeScript e Vite
- Tailwind CSS
- React Router
- QR Code (`qrcode`)
- APIs PHP com cURL para as integrações de pagamento

## Executar localmente

Pré-requisitos: Node.js 20+ e npm. Para testar as APIs de pagamento localmente, é necessário também um servidor PHP com a extensão cURL habilitada.

```bash
npm install
npm run dev
```

Comandos disponíveis:

```bash
npm run lint
npm run build
npm run preview
```

> O Vite encaminha chamadas para `/api` ao servidor configurado em `vite.config.ts`. Em produção, os arquivos da pasta `api/` devem estar publicados no mesmo domínio do frontend.

## Deploy na Hostinger

A aplicação é estática (após build) e os PHPs rodam no próprio servidor Apache da Hostinger. Passo a passo:

1. **Build do frontend:**
   ```bash
   npm run build
   ```
   Isso gera a pasta `dist/` com HTML, JS e CSS.

2. **Subir arquivos pelo Gerenciador de Arquivos da Hostinger:**
   - Acesse `hPanel → Gerenciador de Arquivos`
   - Entre na pasta `public_html/` (ou no domínio adicionado)
   - Suba **todo o conteúdo de `dist/`** para dentro de `public_html/`
   - Crie a pasta `api/` dentro de `public_html/` e suba os arquivos:
     - `createPix.php`
     - `checkPix.php`
     - `processCardPayment.php`
     - `config.php` (com credenciais reais — veja abaixo)
     - `gifts_data.php`
     - `.htaccess`
   - **NÃO suba** `config.example.php` nem `version.php` (não são usados em produção)

3. **Configurar `.env` antes do build** com a chave pública do Mercado Pago:
   ```env
   VITE_MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_producao
   ```

4. **HTTPS obrigatório** para o Brick do Mercado Pago funcionar. A Hostinger fornece SSL gratuito via Let's Encrypt (ative em `hPanel → SSL`).

5. **Testar:** acesse `https://casamentokiuryeleticia.com.br/` e faça um fluxo completo de pagamento.

## Integrações de pagamento

As credenciais são utilizadas exclusivamente pelas APIs PHP. Elas nunca devem ser expostas no navegador, incluídas no bundle do Vite ou enviadas ao repositório.

### PIX — Woovi (antiga OpenPix)

O fluxo PIX é implementado em três etapas:

1. Ao escolher PIX, o frontend envia o carrinho, valor, descrição e nome para `POST /api/createPix.php`.
2. A API valida os preços server-side (`api/gifts_data.php`), cria a cobrança na Woovi e retorna o código PIX (`brCode`) e o `correlationID`.
3. Após 10 segundos, o frontend consulta `GET /api/checkPix.php?txid=...` a cada 4 segundos (máx. 30 min). Quando a Woovi retorna `status: COMPLETED`, o usuário é redirecionado para `/pagamento-sucesso`.

| Endpoint | Responsabilidade |
| --- | --- |
| `api/createPix.php` | Cria a cobrança via `https://api.woovi.com/api/v1/charge`. |
| `api/checkPix.php` | Consulta a cobrança pelo `correlationID` e retorna o status. |
| `api/gifts_data.php` | Fonte canônica de preços — anti-adulteração. |

### Cartão — Mercado Pago

O pagamento por cartão utiliza o **Card Payment Brick** do Checkout Transparente. O formulário é exibido dentro do site, enquanto os campos sensíveis são tratados e tokenizados pelo Mercado Pago:

1. O Brick coleta e tokeniza os dados do cartão no navegador.
2. O frontend envia o token, o método de pagamento, as parcelas, o pagador e os itens do carrinho para `POST /api/processCardPayment.php`.
3. A API valida os preços server-side, cria uma chave de idempotência e envia o pagamento para `https://api.mercadopago.com/v1/payments` com o token privado apenas no servidor.
4. A resposta determina o fluxo: `approved` → `/pagamento-sucesso`, `pending`/`in_process` → `/pagamento-pendente`, outros erros → mensagem no modal.

| Endpoint | Responsabilidade |
| --- | --- |
| `api/processCardPayment.php` | Processa o token do Brick em `https://api.mercadopago.com/v1/payments`. |

## Configuração das credenciais

1. Copie `api/config.example.php` para `api/config.php` (apenas no servidor, NÃO no git).
2. Preencha as chaves da Woovi, o token privado do Mercado Pago e a URL pública do site:

```php
<?php

define('OPENPIX_API_KEY', 'SUA_CHAVE_PRIVADA_WOOVI');
define('OPENPIX_APP_ID', 'SEU_APP_ID_WOOVI');
define('MP_ACCESS_TOKEN', 'SEU_ACCESS_TOKEN_PRIVADO_MERCADO_PAGO');
define('MP_PUBLIC_KEY', 'SUA_CHAVE_PUBLICA_MERCADO_PAGO');
define('SITE_URL', 'https://casamentokiuryeleticia.com.br/');
define('PIX_VERIFICATION_DELAY', 10);
define('PIX_VERIFICATION_INTERVAL', 4);
```

A `MP_PUBLIC_KEY` do PHP é apenas documentativa; o frontend usa a env var `VITE_MERCADO_PAGO_PUBLIC_KEY` no build.

`api/config.php` está no `.gitignore`. Use credenciais de teste durante o desenvolvimento e credenciais de produção **somente** no servidor.

### 🔑 Rotação de chaves (IMPORTANTE)

Caso `config.php` com credenciais reais já tenha sido commitado no git (mesmo que removido depois), o histórico ainda contém as chaves. Para garantir segurança:

1. **Painel Woovi:** gere nova API Key em `Configurações → API`. Revogue a antiga.
2. **Painel Mercado Pago:** gere novo Access Token em `Suas integrações → Dados de acesso`. Revogue o anterior.
3. **Atualize `api/config.php` no servidor** com as novas credenciais.
4. **Rebuild e redeploy** do frontend se a `VITE_MERCADO_PAGO_PUBLIC_KEY` também tiver sido rotacionada.

> Como `config.php` está no `.gitignore`, o arquivo local nunca deve ser commitado. Se em algum momento ele foi, siga os passos acima para rotacionar tudo.

## Estrutura relevante

```text
src/
  components/
    CardPayment.tsx       # Formulário Card Payment Brick
    PixPayment.tsx        # QR Code e acompanhamento PIX
  pages/
    Pagamento.tsx         # Seleção da forma de pagamento
    PagamentoSucesso.tsx  # Após pagamento aprovado
    PagamentoPendente.tsx # Status pendente (análise)
    PagamentoFalha.tsx    # Reservada para falhas (via webhook futuro)
api/
  createPix.php           # Criação da cobrança Woovi
  checkPix.php            # Consulta de status Woovi
  processCardPayment.php  # Processamento transparente do cartão
  gifts_data.php          # Preços canônicos (anti-adulteração)
  config.example.php      # Modelo de configurações privadas
  .htaccess               # Bloqueia PHPs sensíveis (Apache 2.4)
```

## Segurança e operação

- ✅ CORS restrito a `https://casamentokiuryeleticia.com.br` e `http://localhost:5173` (dev).
- ✅ `.htaccess` bloqueia todos os PHPs por padrão, liberando apenas os 3 endpoints públicos.
- ✅ Preços validados server-side contra `gifts_data.php` — não confia no `price` enviado pelo cliente.
- ✅ Respostas de erro sanitizadas (não vazam `mp_response` completo nem substring da Woovi).
- ✅ cURLs com `CURLOPT_TIMEOUT` (15-30s) para evitar requisições penduradas.
- ✅ Logs de debug gateados por `import.meta.env.DEV` (não aparecem em produção).
- ✅ Limpeza do carrinho centralizada em `PagamentoSucesso`.
- ✅ Polling do PIX usa `isMountedRef` para evitar `setState` após desmontar.
- ✅ Idempotency-Key enviado ao Mercado Pago em cada request de cartão.
- ⚠️ **HTTPS obrigatório** em produção (clipboard API, Brick do MP, cookies seguros).
- ⚠️ Valide webhooks no servidor para confirmar pagamentos de forma confiável; a consulta periódica do frontend melhora a experiência do usuário, mas não substitui uma confirmação de backend.
