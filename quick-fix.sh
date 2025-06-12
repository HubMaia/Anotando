#!/bin/bash

echo "🛑 Parando tudo..."
sudo docker-compose down
sudo docker system prune -f

echo "🔨 Construindo backend..."
sudo docker-compose build backend --no-cache

echo "🧪 Testando backend isoladamente..."
sudo docker run --rm --name test-backend anotando-backend echo "Backend container criado com sucesso!"

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
