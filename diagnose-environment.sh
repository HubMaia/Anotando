#!/bin/bash

echo "🔍 DIAGNÓSTICO DE AMBIENTE - Azure vs Local"
echo "=========================================="

echo ""
echo "📋 Informações do Sistema:"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"')"
echo "Kernel: $(uname -r)"
echo "Arquitetura: $(uname -m)"

echo ""
echo "🐳 Informações do Docker:"
echo "Versão Docker: $(docker --version)"
echo "Versão Docker Compose: $(docker-compose --version)"

echo ""
echo "📁 Estrutura de arquivos:"
echo "Pasta atual: $(pwd)"
echo "Conteúdo:"
ls -la

echo ""
echo "📦 Package.json do backend:"
if [ -f "backend/package.json" ]; then
    echo "✅ backend/package.json encontrado"
    echo "Dependências principais:"
    grep -A 10 '"dependencies"' backend/package.json
else
    echo "❌ backend/package.json NÃO encontrado"
fi

echo ""
echo "🔧 Variáveis de ambiente relevantes:"
echo "NODE_ENV: ${NODE_ENV:-'não definida'}"
echo "USER: ${USER:-'não definida'}"

echo ""
echo "🐳 Status atual do Docker:"
sudo docker ps -a

echo ""
echo "🖼️ Imagens Docker disponíveis:"
sudo docker images | grep -E "(anotando|node|mysql)"

echo ""
echo "📝 Logs completos do backend (se existir):"
if sudo docker-compose ps | grep -q backend; then
    sudo docker-compose logs backend
else
    echo "❌ Container backend não está rodando"
fi

echo ""
echo "🌐 Teste de rede interno:"
echo "Testando conectividade interna entre containers..."
if sudo docker-compose ps | grep -q db; then
    echo "✅ DB container está rodando"
    sudo docker-compose exec -T db mysql -h localhost -u root -p1234 -e "SELECT 'DB OK' as status;" 2>/dev/null || echo "❌ Erro ao conectar no DB"
else
    echo "❌ DB container não está rodando"
fi

echo ""
echo "📊 Uso de recursos:"
echo "RAM:"
free -h
echo "Disk:"
df -h | grep -E "(/$|/var)"

echo ""
echo "✅ Diagnóstico concluído!"
