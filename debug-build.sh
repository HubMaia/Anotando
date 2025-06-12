#!/bin/bash

echo "🔍 DEBUG: Verificando estrutura do projeto..."
echo "📁 Arquivos na raiz:"
ls -la

echo ""
echo "📁 Arquivos no backend:"
ls -la backend/

echo ""
echo "📋 Conteúdo do package.json do backend:"
cat backend/package.json | head -20

echo ""
echo "🔄 Parando containers existentes..."
sudo docker-compose down

echo ""
echo "🧹 Removendo todas as imagens Docker relacionadas..."
sudo docker rmi -f $(sudo docker images | grep anotando | awk '{print $3}') 2>/dev/null || true
sudo docker system prune -f

echo ""
echo "🔨 Construindo APENAS o backend primeiro para debug..."
sudo docker build -t anotando-backend-debug -f backend/Dockerfile . --no-cache

echo ""
echo "🧪 Testando se o backend funciona sozinho..."
sudo docker run --rm anotando-backend-debug node -e "console.log('Node.js funcionando!'); try { require('express'); console.log('Express encontrado!'); } catch(e) { console.log('Erro Express:', e.message); }"

echo ""
echo "🚀 Agora construindo tudo com docker-compose..."
sudo docker-compose build --no-cache

echo ""
echo "📦 Iniciando containers..."
sudo docker-compose up -d

echo ""
echo "⏳ Aguardando 15 segundos..."
sleep 15

echo ""
echo "📊 Status dos containers:"
sudo docker-compose ps

echo ""
echo "📝 Logs detalhados do backend:"
sudo docker-compose logs backend

echo ""
echo "🔍 Verificando se o express existe no container:"
sudo docker-compose exec backend ls -la node_modules/express/ || echo "Express não encontrado no container!"

echo ""
echo "✅ Debug concluído!"
