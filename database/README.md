# Banco de Dados - Presentes de Casamento

Estrutura com **2 tabelas** + **5 categorias**.

## 📋 Estrutura

```
┌──────────────────┐       ┌──────────────────┐
│    presentes     │ 1:N   │      vendas      │
├──────────────────┤       ├──────────────────┤
│ id (PK)         │──────→│ id (PK)          │
│ nome            │       │ presente_id (FK) │
│ preco           │       │ quantidade       │
│ categoria (*)   │       │ subtotal         │
│ imagem_url      │       │ metodo_pagamento │
│ cotas_totais    │       │ created_at       │
│ cotas_disp (**) │       └──────────────────┘
│ ativo           │
└──────────────────┘

(*) Categorias: eletros, casa, divertidos, utensilios, vales
(**) Atualizado automaticamente pelo trigger
```

## 🏷️ Categorias (5)

| Categoria | Presentes | Qtd |
|-----------|-----------|-----|
| **Eletros** | Geladeira, Fogão, Microondas, Cafeteira, Pipoqueira, Chaleira, Sanduicheira | 7 |
| **Casa** | Coberta, PS5, Cota Festa, Sal Grosso | 4 |
| **Divertidos** | Calmante, Máscaras de Gás | 2 |
| **Utensílios** | Kit Turbo, Panelas, Colorex, Avental, Rolo Macarrão | 5 |
| **Vales** | Vestido, Dia Noiva, SPA, Fundo TPM, Corte Cabelo, Academia | 6 |

## 🗃️ Tabelas

### `presentes`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT (PK) | Identificador |
| `nome` | VARCHAR(255) | Nome do presente |
| `preco` | DECIMAL(10,2) | Preço da cota |
| `categoria` | ENUM | eletros, casa, divertidos, utensilios, vales |
| `imagem_url` | VARCHAR(512) | URL da imagem |
| `cotas_totais` | INT | Total de cotas |
| `cotas_disponiveis` | INT | Cotas livres |
| `ativo` | TINYINT(1) | Se está à venda |

### `vendas`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT (PK) | Identificador |
| `presente_id` | INT (FK) | Presente comprado |
| `quantidade` | INT | Qtd de cotas |
| `preco_unitario` | DECIMAL(10,2) | Preço na compra |
| `subtotal` | DECIMAL(10,2) | Total |
| `metodo_pagamento` | ENUM | pix, cartao |
| `created_at` | TIMESTAMP | Data |

## 🔧 Funções PHP

```php
getPresentesAtivos()                    // Todos (ordem randômica)
getPresentesPorCategoria('eletros')     // Por categoria
getCategorias()                         // Estatísticas
getListaCategorias()                    // ['eletros' => 'Eletros', ...]
registrarVendas($cart, 'pix')          // Registrar vendas
```

## 🚀 Instalação

```sql
CREATE DATABASE casamento_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE casamento_db;
SOURCE create_database.sql;
```

---

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `schema.sql` | Script SQL completo para criar banco na Hostinger |
| `GUIA_HOSTINGER.md` | Passo a passo completo de configuração |
| `db.php` | Funções PHP auxiliares (legado) |
| `create_database.sql` | Schema original |
| `DIAGRAMA.txt` | Diagrama ASCII do banco |

---

## 🔗 Integração com API PHP

Após criar o banco na Hostinger:

1. Execute o `schema.sql` via phpMyAdmin
2. Atualize `api/config/database.php` com suas credenciais
3. Siga o `GUIA_HOSTINGER.md` para configuração completa
