#!/bin/bash

# Script para obter certificados SSL iniciais
# Execute este script apenas na primeira vez

set -e

echo "🔐 Obtendo certificados SSL para anotandotcc.shop..."

# Criar diretórios necessários
mkdir -p ./certbot/www
mkdir -p ./certbot/conf

# Parar containers se estiverem rodando
echo "📋 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down || true

# Iniciar apenas o nginx temporariamente para validação
echo "🚀 Iniciando nginx temporário para validação..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Aguardar nginx iniciar
sleep 10

# Obter certificados
echo "📜 Solicitando certificados SSL..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email seu-email@exemplo.com \
    --agree-tos \
    --no-eff-email \
    -d anotandotcc.shop \
    -d www.anotandotcc.shop

# Parar nginx temporário
echo "⏹️ Parando nginx temporário..."
docker-compose -f docker-compose.prod.yml down

echo "✅ Certificados SSL obtidos com sucesso!"
echo "🔄 Agora você pode iniciar todos os serviços com: docker-compose -f docker-compose.prod.yml up -d"
