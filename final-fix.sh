#!/bin/bash

echo "🛑 Parando e removendo containers antigos..."
sudo docker-compose down
sudo docker container prune -f
sudo docker image rm anotando-backend anotando-frontend 2>/dev/null || true

echo "🔨 Construindo nova imagem do backend..."
sudo docker-compose build --no-cache backend

echo "✅ Verificando se o build teve sucesso..."
if sudo docker images | grep -q anotando-backend; then
    echo "✅ Imagem do backend criada com sucesso!"
else
    echo "❌ Falha na criação da imagem do backend!"
    exit 1
fi

echo "🚀 Iniciando todos os containers..."
sudo docker-compose up -d

echo "⏳ Aguardando containers iniciarem..."
sleep 15

echo "📊 Status dos containers:"
sudo docker-compose ps

echo ""
echo "📝 Logs do backend (últimas 10 linhas):"
sudo docker-compose logs --tail=10 backend

echo ""
echo "🔍 Testando se os serviços estão respondendo..."
echo "Frontend (esperando 200):"
curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "Falha ao conectar"

echo ""
echo "Backend (esperando 200):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Falha ao conectar"

echo ""
echo "✅ Processo concluído!"
