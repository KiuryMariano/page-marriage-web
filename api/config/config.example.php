<?php
// Arquivo de exemplo - Renomeie para config.php e preencha suas credenciais
// Localização: api/config/config.php (ao lado do database.php)
// Este arquivo é seguro para versionar (sem credenciais reais)

// Woovi/OpenPix — credencial única gerada no painel da Woovi
// (formato base64 Client_Id:Client_Secret), usada no header Authorization
define('WOOVI_APP_ID', 'SUA_API_KEY_AQUI');

// Mercado Pago Credentials
define('MP_ACCESS_TOKEN', 'APP_USR-SEU_ACCESS_TOKEN_AQUI');
// A chave pública deve ficar em VITE_MERCADO_PAGO_PUBLIC_KEY no arquivo .env do frontend.

// URLs do site
define('SITE_URL', 'https://seusite.com');
