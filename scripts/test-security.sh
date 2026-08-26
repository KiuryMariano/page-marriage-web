#!/bin/bash

# ============================================
# Script de Teste de Segurança - Casamento K&L
# ============================================
# Testa todas as correções de segurança implementadas
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
TOTAL=0
PASS=0
FAIL=0

# Função de teste
test_case() {
    local name="$1"
    local expected="$2"
    local command="$3"

    TOTAL=$((TOTAL + 1))
    echo -n "Testing: $name... "

    result=$(eval "$command" 2>&1)

    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}PASS${NC}"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        echo "  Expected: $expected"
        echo "  Got: $result"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# Configuração
BASE_URL="${1:-https://casamentokiuryeleticia.com.br}"
echo "Testing against: $BASE_URL"
echo "================================"
echo ""

# ============================================
# Testes de Autenticação
# ============================================
echo "=== AUTENTICAÇÃO ==="

# Test 1: /presentes/create.php deve retornar 401 sem autenticação
test_case \
    "create.php sem auth → 401" \
    "Autenticação necessária" \
    "curl -s -X POST $BASE_URL/api/presentes/create.php -H 'Content-Type: application/json' -d '{\"nome\":\"Teste\",\"preco\":10,\"categoria\":\"casa\"}'"

# Test 2: /presentes/update.php deve retornar 401
test_case \
    "update.php sem auth → 401" \
    "Autenticação necessária" \
    "curl -s -X PUT $BASE_URL/api/presentes/update.php -H 'Content-Type: application/json' -d '{\"id\":1,\"nome\":\"Teste\"}'"

# Test 3: /presentes/delete.php deve retornar 401
test_case \
    "delete.php sem auth → 401" \
    "Autenticação necessária" \
    "curl -s -X DELETE $BASE_URL/api/presentes/delete.php?id=1"

# Test 4: /presentes/upload-image.php deve retornar 401
test_case \
    "upload-image.php sem auth → 401" \
    "Autenticação necessária" \
    "curl -s -X POST $BASE_URL/api/presentes/upload-image.php -F 'imagem=@/dev/null'"

# Test 5: /presentes/delete-image.php deve retornar 401
test_case \
    "delete-image.php sem auth → 401" \
    "Autenticação necessária" \
    "curl -s -X POST $BASE_URL/api/presentes/delete-image.php -H 'Content-Type: application/json' -d '{\"image_url\":\"/imagens-presentes/test.jpg\"}'"

# Test 6: /auth/me.php deve retornar 401 sem sessão
test_case \
    "/auth/me.php sem sessão → 401" \
    "Não autenticado" \
    "curl -s $BASE_URL/api/auth/me.php"

echo ""

# ============================================
# Testes de Validação de Quantity
# ============================================
echo "=== VALIDAÇÃO DE QUANTITY ==="

# Test 7: quantity = 0 deve falhar
test_case \
    "quantity = 0 → 422" \
    "maior que zero" \
    "curl -s -X POST $BASE_URL/api/vendas/create.php -H 'Content-Type: application/json' -d '{\"itens\":[{\"id\":1,\"quantity\":0}],\"metodo_pagamento\":\"pix\"}'"

# Test 8: quantity negativo deve falhar
test_case \
    "quantity = -1 → 422" \
    "maior que zero" \
    "curl -s -X POST $BASE_URL/api/vendas/create.php -H 'Content-Type: application/json' -d '{\"itens\":[{\"id\":1,\"quantity\":-1}],\"metodo_pagamento\":\"pix\"}'"

# Test 9: quantity decimal deve falhar
test_case \
    "quantity = 0.5 → 422" \
    "numérica" \
    "curl -s -X POST $BASE_URL/api/vendas/create.php -H 'Content-Type: application/json' -d '{\"itens\":[{\"id\":1,\"quantity\":0.5}],\"metodo_pagamento\":\"pix\"}'"

# Test 10: quantity string deve falhar
test_case \
    "quantity = 'banana' → 422" \
    "numérica" \
    "curl -s -X POST $BASE_URL/api/vendas/create.php -H 'Content-Type: application/json' -d '{\"itens\":[{\"id\":1,\"quantity\":\"banana\"}],\"metodo_pagamento\":\"pix\"}'"

# Test 11: quantity > 10 deve falhar
test_case \
    "quantity > 10 → 422" \
    "máxima.*10" \
    "curl -s -X POST $BASE_URL/api/vendas/create.php -H 'Content-Type: application/json' -d '{\"itens\":[{\"id\":1,\"quantity\":11}],\"metodo_pagamento\":\"pix\"}'"

echo ""

# ============================================
# Testes de CORS
# ============================================
echo "=== CORS ==="

# Test 12: Origem arbitrária não deve receber ACAO
test_case \
    "Origem evil.com sem ACAO" \
    "Access-Control-Allow-Origin:" \
    "curl -s -I -X OPTIONS $BASE_URL/api/presentes/upload-image.php -H 'Origin: https://evil.com' -H 'Access-Control-Request-Method: POST'"

echo ""

# ============================================
# Testes de Headers de Segurança
# ============================================
echo "=== HEADERS DE SEGURANÇA ==="

# Test 13: HSTS presente
test_case \
    "HSTS presente" \
    "Strict-Transport-Security" \
    "curl -s -I $BASE_URL/"

# Test 14: CSP presente
test_case \
    "CSP presente" \
    "Content-Security-Policy" \
    "curl -s -I $BASE_URL/"

# Test 15: nosniff presente
test_case \
    "nosniff presente" \
    "X-Content-Type-Options.*nosniff" \
    "curl -s -I $BASE_URL/"

# Test 16: Referrer-Policy presente
test_case \
    "Referrer-Policy presente" \
    "Referrer-Policy" \
    "curl -s -I $BASE_URL/"

# Test 17: X-Powered-By ausente
test_case \
    "X-Powered-By ausente" \
    "" \
    "curl -s -I $BASE_URL/ | grep -v 'X-Powered-By'"

echo ""

# ============================================
# Resumo
# ============================================
echo "================================="
echo "RESumo"
echo "================================="
echo -e "Total: $TOTAL"
echo -e "${GREEN}Pass: $PASS${NC}"
echo -e "${RED}Fail: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}✗ Alguns testes falharam${NC}"
    exit 1
fi
