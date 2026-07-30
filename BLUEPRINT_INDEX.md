# 📑 Índice de Documentação - Integração Hostinger MySQL

> **Documentação completa para replicação da arquitetura de integração com banco de dados MySQL na Hostinger**

---

## 🎯 Documentos Disponíveis

| Documento | Propósito | Quando Usar |
|-----------|-----------|-------------|
| **[CLAUDE_AGENT_BLUEPRINT.md](CLAUDE_AGENT_BLUEPRINT.md)** | Blueprint técnico completo | Para replicar a arquitetura completa |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Referência rápida | Para consulta rápida de comandos e configs |
| **[DEPLOY.md](DEPLOY.md)** | Guia de deploy | Para fazer deploy na Hostinger |
| **[api/README.md](api/README.md)** | Documentação da API | Para entender endpoints da API PHP |
| **[db/README.md](db/README.md)** | Documentação do DB | Para entender estrutura do banco |
| **[INICIAR.md](INICIAR.md)** | Início rápido | Para iniciar o projeto localmente |

---

## 🚀 Quick Start (Replicação Rápida)

### Passo 1: Copiar Arquivos Base
```bash
# Estrutura mínima
api/
├── config/
│   └── database.php    # Copiar e adaptar
├── .htaccess           # Copiar
└── {modulo}/
    └── endpoint.php   # Usar padrão CRUD
```

### Passo 2: Configurar Proxy
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Passo 3: Criar Banco na Hostinger
1. Painel Hostinger → Bancos de Dados → MySQL
2. Criar banco e anotar credenciais
3. Configurar acesso remoto (se necessário)
4. Executar schema via phpMyAdmin

### Passo 4: Testar Localmente
```bash
# Terminal 1
php -S localhost:8000 -t api/

# Terminal 2
npm run dev

# Testar
curl http://localhost:8000/{modulo}/endpoint.php
```

### Passo 5: Deploy
```bash
npm run build
# Upload dist/ → public_html/
# Upload api/ → public_html/api/
```

---

## 📊 Arquitetura Resumida

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │ ──▶│  PHP API (Vite) │ ──▶│  MySQL Hostinger│
│  localhost:5173 │    │  localhost:8000 │    │  srvXXX.hstgr.io│
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                      │                      │
   fetch('/api/...')    endpoint.php         PDO Connection
```

---

## 🔗 Endpoints Padrão

### CRUD Básico
```
GET    /api/{modulo}/{recurso}.php       - Listar todos
POST   /api/{modulo}/{recurso}.php       - Criar novo
PUT    /api/{modulo}/{recurso}.php?id=X - Atualizar
DELETE /api/{modulo}/{recurso}.php?id=X - Remover
```

### Autenticação
```
POST   /api/auth/login.php    - Fazer login
POST   /api/auth/register.php - Criar usuário
```

### Upload
```
POST   /api/{modulo}/upload.php - Upload de arquivos (multipart/form-data)
```

---

## 📝 Variáveis de Ambiente

### `.env` (Raiz - Frontend)
```env
VITE_ADMIN_EMAIL=admin@exemplo.com
VITE_ADMIN_PASSWORD=senha123
```

### `api/config/database.php` (Backend)
```php
// Produção (Hostinger)
$host_production = 'localhost';
$db_production = 'uXXXXXXXX_database';
$user_production = 'uXXXXXXXX_user';
$pass_production = 'sua_hostinger_senha';

// Local (Desenvolvimento - acesso remoto)
$host_local = 'srvXXX.hstgr.io';
$db_local = 'uXXXXXXXX_database';
$user_local = 'uXXXXXXXX_user';
$pass_local = 'sua_hostinger_senha';
```

---

## 🛠️ Comandos Essenciais

### Desenvolvimento
```bash
# API PHP
php -S localhost:8000 -t api/

# Frontend
npm run dev

# Verificar IP (para autorizar na Hostinger)
curl -s ifconfig.me
```

### Deploy
```bash
# Build
npm run build

# Verificar driver PDO MySQL
php -m | grep -i pdo_mysql

# Instalar driver se necessário
sudo apt-get install php8.3-mysql
```

### Banco de Dados
```bash
# Conectar ao MySQL remoto
mysql -h srvXXX.hstgr.io -u uXXXXXXXX_user -p uXXXXXXXX_database

# Executar script
mysql -h host -u user -p db < schema.sql
```

---

## ⚠️ Pontos de Atenção

### Segurança
1. **Prepared Statements**: Sempre usar PDO com prepared statements
2. **Password Hashing**: Usar `password_hash()` do PHP
3. **HTTPS**: Obrigatório em produção
4. **CORS**: Configurar headers adequadamente
5. **Validação**: Validar inputs no backend

### Configuração
1. **IP Autorizado**: Hostinger requer autorização de IP para acesso remoto
2. **Ambiente**: Detectar automaticamente (local vs produção)
3. **Proxy**: Vite proxy necessário em desenvolvimento
4. **Charset**: Usar utf8mb4 para suporte completo

### Troubleshooting Comum

| Erro | Solução |
|------|---------|
| `could not find driver` | `sudo apt install php8.3-mysql` |
| `Access denied` | Verificar credenciais e IP autorizado |
| `Connection refused` | `php -S localhost:8000 -t api/` |
| `404 Not Found` | Verificar proxy e caminhos |
| `CORS error` | Adicionar headers CORS |

---

## 📚 Estrutura de Tabelas

### Tabela Padrão
```sql
CREATE TABLE tabela (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campo VARCHAR(255) NOT NULL,
  campo_json JSON CHECK (JSON_VALID(campo_json)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_campo (campo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabelas do Projeto
- **users**: Autenticação (email, password hash)
- **sports_events**: Eventos esportivos (título, data, esporte, imagens JSON)
- **projects**: Portfólio de projetos (dados completos em JSON)

---

## ✅ Checklist de Replicação

### Mínimo Viável
- [ ] Copiar `api/config/database.php`
- [ ] Atualizar credenciais Hostinger
- [ ] Criar banco no painel Hostinger
- [ ] Configurar acesso remoto (se necessário)
- [ ] Criar schema SQL
- [ ] Criar 1 endpoint PHP (GET)
- [ ] Configurar proxy Vite
- [ ] Testar localmente
- [ ] Deploy e testar produção

### Completo
- [ ] Todos endpoints CRUD
- [ ] Upload de arquivos
- [ ] Autenticação completa
- [ ] Validação de inputs
- [ ] Tratamento de erros
- [ ] Logs e debug
- [ ] Backup do banco
- [ ] HTTPS configurado

---

## 🆚 Ambientes

| Característica | Local | Produção |
|----------------|-------|----------|
| **Frontend** | localhost:5173 | https://seusite.com |
| **API** | localhost:8000 | https://seusite.com/api |
| **MySQL** | srvXXX.hstgr.io (remoto) | localhost (mesmo servidor) |
| **Proxy** | Vite proxy necessário | Não necessário |
| **Debug** | Ativo | Desabilitar |

---

## 📞 Suporte e Referências

- **Blueprint Completo**: `CLAUDE_AGENT_BLUEPRINT.md`
- **Referência Rápida**: `QUICK_REFERENCE.md`
- **Guia de Deploy**: `DEPLOY.md`
- **Documentação API**: `api/README.md`
- **Documentação DB**: `db/README.md`

---

**Última atualização**: 2025-07-14  
**Versão**: 1.0.0  
**Compatível com**: Claude Agents (Opus 4.8+, Sonnet 5+)
