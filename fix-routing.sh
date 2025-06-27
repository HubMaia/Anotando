#!/bin/bash

echo "🔧 CORREÇÃO: Configurando nginx para React Router e proxy para API"
echo "=================================================================="

echo ""
echo "🛑 Parando containers..."
sudo docker-compose -f docker-compose.prod.yml down

echo ""
echo "🧹 Removendo imagem antiga do frontend..."
sudo docker rmi anotando-frontend 2>/dev/null || true

echo ""
echo "🔨 Reconstruindo APENAS o frontend com nova configuração nginx..."
sudo docker-compose -f docker-compose.prod.yml build --no-cache frontend

echo ""
echo "🚀 Iniciando todos os containers..."
sudo docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Aguardando 15 segundos para estabilizar..."
sleep 15

echo ""
echo "📊 Status dos containers:"
sudo docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Testando as rotas:"
echo ""
echo "1. Página inicial (/):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost/

echo ""
echo "2. Dashboard (/dashboard) - deve retornar HTML do React, não 404:"
response=$(curl -s http://localhost/dashboard)
if echo "$response" | grep -q "<!DOCTYPE html>"; then
    echo "✅ Status: 200 - React app carregado"
else
    echo "❌ Erro: Não retornou HTML válido"
fi

echo ""
echo "3. API Backend (/api via proxy):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost/api/ || echo "Backend não respondeu"

echo ""
echo "🔍 Verificando configuração do nginx no container:"
sudo docker-compose -f docker-compose.prod.yml exec frontend cat /etc/nginx/conf.d/default.conf | head -10

echo ""
echo "📝 Logs do frontend:"
sudo docker-compose -f docker-compose.prod.yml logs --tail=5 frontend

echo ""
echo "✅ Correção aplicada!"
echo ""
echo "🌐 Teste manual:"
echo "   - Acesse: http://localhost"
echo "   - Navegue para: http://localhost/dashboard"
echo "   - Deve carregar a aplicação React sem erro 404"
