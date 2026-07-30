# 📤 Deploy da API na Hostinger

> **Arquivos da API precisam ser enviados para a Hostinger**

## 📁 Arquivos para Upload

Envie a pasta `api/` completa para `public_html/api/`:

```
api/
├── config/
│   └── database.php       ⚠️ CREDENCIAIS JÁ CONFIGURADAS
├── presentes/
│   ├── list.php
│   ├── categorias.php
│   └── status.php
├── vendas/
│   ├── create.php
│   └── list.php
├── .htaccess              ✅ JÁ ATUALIZADO
├── createPix.php          ✅ JÁ EXISTE
├── checkPix.php           ✅ JÁ EXISTE
└── processCardPayment.php ✅ JÁ EXISTE
```

## 🚀 Como Fazer Upload

### Opção 1: FTP (FileZilla, etc.)

1. Conecte ao FTP da Hostinger
2. Navegue para `public_html/`
3. Arraste a pasta `api/` do projeto
4. Sobrescrever arquivos existentes

### Opção 2: Gerenciador de Arquivos Hostinger

1. Acesse hPanel → **Gerenciador de Arquivos**
2. Vá para `public_html/`
3. Upload de cada arquivo para `api/`

### Opção 3: Git (se configurado)

```bash
git add api/
git commit -m "feat: integração com banco MySQL"
git push
```

## ✅ Após Upload

Teste o endpoint:
```
https://casamentokiuryeleticia.com.br/api/presentes/list.php
```

Deve retornar JSON com os presentes:
```json
{
  "success": true,
  "data": [...],
  "total": 24
}
```

## ⚠️ Importante

- O arquivo `api/config/database.php` já está configurado com suas credenciais
- Não modifique as credenciais após o upload
- O arquivo está no `.gitignore` por segurança

---

## 📋 Checklist

- [ ] Upload da pasta `api/` completa
- [ ] Testar `/api/presentes/list.php`
- [ ] Testar `/api/presentes/categorias.php`
- [ ] Testar `/api/vendas/create.php`
- [ ] Iniciar `npm run dev` localmente
- [ ] Acessar `/presentes` e verificar se carrega do banco
