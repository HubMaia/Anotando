#!/bin/bash

echo "🎯 SOLUÇÃO: Usando docker-compose.prod.yml (sem volumes de desenvolvimento)"
echo "============================================================================"

echo ""
echo "🛑 Parando containers atuais..."
sudo docker-compose down

echo ""
echo "🧹 Limpeza de imagens antigas..."
sudo docker rmi anotando-backend anotando-frontend 2>/dev/null || true

echo ""
echo "🔨 Construindo com configuração de PRODUÇÃO..."
sudo docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Iniciando com configuração de PRODUÇÃO..."
sudo docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Aguardando 15 segundos para estabilizar..."
sleep 15

echo ""
echo "📊 Status dos containers:"
sudo docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📝 Logs do backend:"
sudo docker-compose -f docker-compose.prod.yml logs --tail=10 backend

echo ""
echo "🌐 Testando conectividade:"
echo -n "Frontend: "
curl -s -o /dev/null -w "%{http_code}" http://localhost
echo ""
echo -n "Backend: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
echo ""

echo ""
echo "🔍 Verificando se o node_modules existe no container:"
sudo docker-compose -f docker-compose.prod.yml exec backend ls -la node_modules/express/ || echo "Express não encontrado"

echo ""
echo "✅ Deploy com configuração de produção concluído!"
echo "📝 Para gerenciar os containers, use:"
echo "   sudo docker-compose -f docker-compose.prod.yml [COMMAND]"
