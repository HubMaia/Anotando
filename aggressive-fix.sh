#!/bin/bash

echo "🛑 LIMPEZA AGRESSIVA - Parando tudo..."
sudo docker-compose down --volumes --remove-orphans

echo "🧹 Removendo TODAS as imagens relacionadas..."
sudo docker rmi -f $(sudo docker images -q --filter=reference="anotando*") 2>/dev/null || true

echo "🗑️ Limpeza geral do Docker..."
sudo docker system prune -af
sudo docker volume prune -f

echo "🔍 Verificando se as imagens foram removidas..."
sudo docker images | grep anotando || echo "✅ Nenhuma imagem anotando encontrada - limpeza bem sucedida!"

echo ""
echo "🔨 Construindo APENAS o backend primeiro..."
sudo docker build -t anotando-backend-test -f backend/Dockerfile . --no-cache --progress=plain

echo ""
echo "🧪 Testando se o Express foi instalado no build..."
sudo docker run --rm anotando-backend-test node -e "try { require('express'); console.log('✅ Express OK!'); } catch(e) { console.log('❌ Express ERRO:', e.message); }"

echo ""
echo "🔨 Agora construindo tudo com docker-compose..."
sudo docker-compose build --no-cache --parallel

echo ""
echo "🚀 Iniciando containers..."
sudo docker-compose up -d

echo ""
echo "⏳ Aguardando 20 segundos para estabilizar..."
sleep 20

echo ""
echo "📊 Status final:"
sudo docker-compose ps

echo ""
echo "📝 Logs do backend:"
sudo docker-compose logs --tail=15 backend

echo ""
echo "🌐 Testando conectividade:"
echo -n "Frontend: "
curl -s -o /dev/null -w "%{http_code}" http://localhost
echo ""
echo -n "Backend: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
echo ""
