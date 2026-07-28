# Cartões de Teste - Mercado Pago

Use estes dados para testar pagamentos em ambiente de sandbox/teste.

## ⚠️ IMPORTANTE - Email

O Mercado Pago **bloqueia** certos domínios em ambiente de teste:
- ❌ gmail.com, hotmail.com, outlook.com, yahoo.com
- ✅ exemplo.com, test.com, demo.com, teste.com.br

**Use sempre:** `teste@exemplo.com` ou similar

---

## Cartões em Uso

### Mastercard APROVADO
```
Número: 5031 4332 1540 6351
Validade: 11/30
CVV: 123
Nome: APRO
CPF: 12345678909
Email: teste@exemplo.com ✓
```

### Visa APROVADO
```
Número: 4235 6477 2802 5682
Validade: 11/30
CVV: 123
Nome: APRO
CPF: 12345678909
Email: teste@exemplo.com ✓
```

---

## Status de Pagamento (coloque no NOME do titular)

| Status | Nome | Resultado |
|--------|------|-----------|
| Aprovado | `APRO` | Pagamento aprovado ✓ |
| Recusado | `OTHE` | Erro geral |
| Pendente | `CONT` | Pagamento pendente |

---

**Notas:**
- O CPF pode ser qualquer número válido (11 dígitos)
- Email deve usar domínios que não sejam gmail/hotmail/outlook
- O erro `excludes_by_rule` geralmente é causado por email bloqueado
