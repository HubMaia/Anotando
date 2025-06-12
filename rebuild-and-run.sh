#!/bin/bash

echo "🔄 Parando containers existentes..."
sudo docker-compose down

echo "🧹 Removendo imagens antigas..."
sudo docker rmi -f anotando-backend anotando-frontend || true

echo "🔨 Reconstruindo imagens sem cache..."
sudo docker-compose build --no-cache

echo "🚀 Iniciando containers..."
sudo docker-compose up -d

echo "⏳ Aguardando 10 segundos para os containers inicializarem..."
sleep 10

echo "📊 Status dos containers:"
sudo docker-compose ps

echo "📝 Logs do backend (últimas 20 linhas):"
sudo docker-compose logs --tail=20 backend

echo "✅ Processo concluído!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend: http://localhost:3000"
