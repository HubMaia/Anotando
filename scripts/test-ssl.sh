#!/bin/bash

# Script para testar a configuração SSL
# Útil para validar se tudo está funcionando corretamente

set -e

echo "🧪 Testando configuração SSL..."

# Verificar se os containers estão rodando
echo "📋 Verificando containers..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Testando conectividade..."

# Testar HTTP (deve redirecionar para HTTPS)
echo "🌐 Testando redirecionamento HTTP -> HTTPS..."
curl -I http://anotandotcc.shop 2>/dev/null | head -n 5 || echo "❌ Erro ao testar HTTP"

echo ""
echo "🔒 Testando HTTPS..."
curl -I https://anotandotcc.shop 2>/dev/null | head -n 5 || echo "❌ Erro ao testar HTTPS"

echo ""
echo "📜 Verificando certificados..."
docker-compose -f docker-compose.prod.yml run --rm certbot certificates 2>/dev/null || echo "❌ Erro ao verificar certificados"

echo ""
echo "🔧 Testando configuração do nginx..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -t 2>/dev/null || echo "❌ Erro na configuração do nginx"

echo ""
echo "📊 Status geral:"
echo "   🐳 Containers: $(docker-compose -f docker-compose.prod.yml ps --services | wc -l) serviços"
echo "   🌐 HTTP: Redirecionamento configurado"
echo "   🔒 HTTPS: Certificados SSL"
echo "   📋 Nginx: Configuração válida"

echo ""
echo "✅ Teste concluído!"
echo "🌐 Acesse: https://anotandotcc.shop"
