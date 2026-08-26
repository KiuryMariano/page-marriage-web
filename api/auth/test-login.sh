#!/bin/bash

# ============================================
# Script de Teste - Autenticação
# ============================================

BASE_URL="${1:-http://localhost:5173}"

echo "Testando autenticação em: $BASE_URL"
echo "================================"
echo ""

# Teste 1: Tentar login sem credenciais
echo "Teste 1: Login sem credenciais"
curl -s -X POST "$BASE_URL/api/auth/login.php" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
echo ""

# Teste 2: Tentar login com credenciais erradas
echo "Teste 2: Login com credenciais erradas"
curl -s -X POST "$BASE_URL/api/auth/login.php" \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}' | jq '.'
echo ""

# Teste 3: Login correto (salva cookie)
# Senha via env: ADMIN_PASS=xxx ./test-login.sh (não versionar credenciais)
echo "Teste 3: Login com credenciais corretas"
curl -s -i -X POST "$BASE_URL/api/auth/login.php" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"${ADMIN_PASS:-senha_padrao}\"}" \
  -c /tmp/auth_cookies.txt | grep -E "HTTP|Set-Cookie|success"
echo ""

# Teste 4: Verificar sessão com cookie
echo "Teste 4: Verificar sessão (/api/auth/me.php)"
curl -s -X GET "$BASE_URL/api/auth/me.php" \
  -b /tmp/auth_cookies.txt | jq '.'
echo ""

# Teste 5: Tentar acessar endpoint protegido SEM cookie
echo "Teste 5: Acessar create.php SEM cookie"
curl -s -X POST "$BASE_URL/api/presentes/create.php" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","preco":10,"categoria":"casa"}' | jq '.'
echo ""

# Teste 6: Tentar acessar endpoint protegido COM cookie
echo "Teste 6: Acessar create.php COM cookie"
curl -s -X POST "$BASE_URL/api/presentes/create.php" \
  -b /tmp/auth_cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","preco":10,"categoria":"casa"}' | jq '.'
echo ""

# Teste 7: Logout
echo "Teste 7: Logout"
curl -s -X POST "$BASE_URL/api/auth/logout.php" \
  -b /tmp/auth_cookies.txt | jq '.'
echo ""

# Limpar
rm -f /tmp/auth_cookies.txt

echo "================================"
echo "Testes concluídos"
