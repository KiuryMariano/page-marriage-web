# Site de casamento

Aplicação web para apresentar o casal, confirmar presença, exibir a galeria e receber presentes em dinheiro. O checkout permite pagamento por **PIX**, com cobrança e consulta de status pela OpenPix, e por **cartão**, com redirecionamento seguro para o Mercado Pago.

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

> O Vite encaminha chamadas para `/api` ao servidor configurado em `vite.config.ts`. Em produção, os arquivos da pasta `api/` devem estar publicados no mesmo domínio do frontend, ou o proxy deve ser ajustado para o ambiente desejado.

## Integrações de pagamento

As credenciais são utilizadas exclusivamente pelas APIs PHP. Elas nunca devem ser expostas no navegador, incluídas no bundle do Vite ou enviadas ao repositório.

### PIX — OpenPix

O fluxo PIX é implementado em três etapas:

1. Ao escolher PIX, o frontend envia o valor, a descrição e o nome para `POST /api/createPix.php`.
2. A API cria uma cobrança na OpenPix e retorna o código PIX (`brCode`) e um identificador de transação (`txid`). O frontend gera o QR Code a partir desse código e oferece o botão Copia e Cola.
3. Após 10 segundos, o frontend consulta `GET /api/checkPix.php?txid=...` a cada 4 segundos. Quando a OpenPix retorna uma cobrança paga, o carrinho é removido do `localStorage` e o usuário é redirecionado.

O status é considerado pago para os valores `completed`, `confirmed`, `concluido`, `success`, `paid` e `aprovado`, além dos campos `paid: true` ou `paidAt` preenchido.

Endpoints envolvidos:

| Endpoint | Responsabilidade |
| --- | --- |
| `api/createPix.php` | Cria a cobrança via `https://api.openpix.com.br/api/v1/charge`. |
| `api/checkPix.php` | Consulta a cobrança pelo `correlationID` e retorna o status para o frontend. |

### Cartão — Mercado Pago

O pagamento por cartão utiliza o **Card Payment Brick** do Checkout Transparente. O formulário é exibido dentro do site, enquanto os campos sensíveis são tratados e tokenizados pelo Mercado Pago:

1. O Brick coleta e tokeniza os dados do cartão no navegador.
2. O frontend envia o token, o método de pagamento, as parcelas, o pagador e os itens do carrinho para `POST /api/processCardPayment.php`.
3. A API calcula o total, cria uma chave de idempotência e envia o pagamento para `https://api.mercadopago.com/v1/payments` com o token privado apenas no servidor.
4. A resposta de aprovação, pendência ou recusa é exibida sem redirecionar o cliente para o checkout hospedado.

O Card Payment Brick atende aos requisitos de coleta segura dos dados de cartão; não crie campos próprios para número, validade ou CVV. A integração ainda deve ser testada com credenciais e cartões de teste antes de receber pagamentos reais.

| Endpoint | Responsabilidade |
| --- | --- |
| `api/processCardPayment.php` | Processa o token do Brick em `https://api.mercadopago.com/v1/payments`. |

## Configuração das credenciais

1. Copie `api/config.example.php` para `api/config.php`.
2. Preencha as chaves da OpenPix, o token privado do Mercado Pago e a URL pública do site.
3. Acrescente os intervalos de consulta PIX ao arquivo de configuração:

```php
<?php

define('OPENPIX_API_KEY', 'SUA_CHAVE_PRIVADA_OPENPIX');
define('OPENPIX_APP_ID', 'SEU_APP_ID_OPENPIX');
define('MP_ACCESS_TOKEN', 'SEU_ACCESS_TOKEN_PRIVADO_MERCADO_PAGO');
define('SITE_URL', 'https://seu-dominio.com');
define('PIX_VERIFICATION_DELAY', 10);
define('PIX_VERIFICATION_INTERVAL', 4);
```

A chave pública é usada pelo frontend e deve ser definida no arquivo `.env` antes do build:

```env
VITE_MERCADO_PAGO_PUBLIC_KEY=SUA_CHAVE_PUBLICA_MERCADO_PAGO
```

`api/config.php` já está no `.gitignore`. Use credenciais de teste durante o desenvolvimento e credenciais de produção somente no servidor de produção. Caso uma chave tenha sido publicada, revogue-a e gere outra no provedor correspondente.

## Estrutura relevante

```text
src/
  components/
    CardPayment.tsx       # Formulário Card Payment Brick
    PixPayment.tsx        # QR Code e acompanhamento PIX
  pages/Pagamento.tsx     # Seleção da forma de pagamento
api/
  createPix.php           # Criação da cobrança OpenPix
  checkPix.php            # Consulta de status OpenPix
  processCardPayment.php  # Processamento transparente do cartão
  config.example.php      # Modelo de configurações privadas
```

## Segurança e operação

- Não registre, imprima ou exponha tokens, payloads sensíveis e respostas completas de provedores de pagamento.
- Configure HTTPS no domínio público antes de usar pagamentos reais.
- Valide webhooks no servidor para confirmar pagamentos de forma confiável; a consulta periódica do frontend melhora a experiência do usuário, mas não substitui uma confirmação de backend.
- Restrinja `Access-Control-Allow-Origin` ao domínio do site em produção.
