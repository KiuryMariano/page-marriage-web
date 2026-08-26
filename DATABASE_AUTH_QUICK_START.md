# 🗄️ Guia Rápido - Instalação da Tabela de Autenticação

## 📋 O que será criado

1. **admin_users** - Tabela de administradores com:
   - Autenticação segura (password_hash/password_verify)
   - Controle de tentativas de login
   - Bloqueio automático após falhas
   - Rastreamento de último login

2. **admin_login_logs** - Logs de tentativas de login (auditoria)

3. **admin_sessions** - Sessões administrativas ativas (controle de múltiplos logins)

## 🚀 Instalação

### Opção 1: Via phpMyAdmin

1. Acesse o phpMyAdmin no painel da Hostinger
2. Selecione seu banco de dados `casamento_db`
3. Clique na aba **Importar**
4. Selecione o arquivo `database/install_auth.sql`
5. Clique em **Executar**

### Opção 2: Via SSH/Linha de Comando

```bash
# Via SSH no servidor
mysql -u SEU_USUARIO -p casamento_db < database/install_auth.sql

# Ou localmente (se tiver acesso remoto)
mysql -h SEU_HOST -u SEU_USUARIO -p casamento_db < database/install_auth.sql
```

### Opção 3: Via Terminal PHP (copiar e colar)

```bash
php -r "
require_once 'database/db.php';
\$sql = file_get_contents('database/install_auth.sql');
\$pdo = getConnection();
\$pdo->exec(\$sql);
echo 'Instalação concluída!' . PHP_EOL;
"
```

## 👤 Administrador Padrão

**Usuário:** `admin`
**Senha:** `leticiaekiury2027`

⚠️ **ALTERAR APÓS PRIMEIRO LOGIN!**

## 🔧 Gerenciamento de Administradores

### Listar administradores

```bash
php database/manage_admins.php
# Opção 1
```

### Criar novo administrador

```bash
php database/manage_admins.php
# Opção 2
```

### Alterar senha

```bash
php database/manage_admins.php
# Opção 3
```

### Gerar hash de senha manualmente

```bash
php api/auth/generate-password-hash.php
```

## 🧪 Verificar Instalação

Execute este comando SQL no phpMyAdmin:

```sql
SELECT
    'Instalação OK!' AS status,
    (SELECT COUNT(*) FROM admin_users) AS admins_cadastrados,
    (SELECT username FROM admin_users WHERE username = 'admin') AS admin_padrao;
```

Deve retornar:
```
status: Instalação OK!
admins_cadastrados: 1
admin_padrao: admin
```

## 📝 Arquivos Envolvidos

- `database/install_auth.sql` - Script de instalação completo
- `database/manage_admins.php` - Gerenciador interativo de admins
- `api/auth/generate-password-hash.php` - Gerador de hashes
- `api/auth/login.php` - Endpoint de login
- `api/auth/logout.php` - Endpoint de logout
- `api/auth/me.php` - Verificação de sessão

## 🔒 Segurança

- Senhas armazenadas com `password_hash()` (bcrypt)
- Sessões PHP com HttpOnly, Secure, SameSite
- Regeneração de session_id no login
- Timeout de 2 horas de inatividade
- Bloqueio após X tentativas falhadas

## ⚠️ Troubleshooting

### Erro: "Tabela já existe"

O script usa `CREATE TABLE IF NOT EXISTS`, então pode ser executado novamente sem problemas.

### Erro: "Usuário já existe"

O admin padrão usa `INSERT ... ON DUPLICATE KEY UPDATE`, então pode ser executado novamente.

### Erro: "admin_users não existe"

Execute o script `install_auth.sql` completo.

## 📞 Suporte

Verifique o `error_log` do PHP se houver problemas:
```bash
tail -f /path/to/error_log
```

---

Após a instalação, você pode fazer login em `/admin` com as credenciais padrão.
**Lembre-se de alterar a senha!** 🔒
