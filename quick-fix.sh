#!/bin/bash

echo "🛑 Parando tudo..."
sudo docker-compose down
sudo docker system prune -f

echo "🔨 Construindo backend..."
sudo docker-compose build --no-cache backend

echo "🧪 Testando se o build funcionou..."
sudo docker images | grep anotando-backend

echo "🔄 Reconstruindo tudo..."
sudo docker-compose build --no-cache

echo "🚀 Subindo containers..."
sudo docker-compose up -d

echo "⏳ Aguardando..."
sleep 10

echo "📊 Status:"
sudo docker-compose ps

echo "📝 Logs backend (últimas 30 linhas):"
sudo docker-compose logs --tail=30 backend
