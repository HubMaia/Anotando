#!/bin/bash

# Script para obter certificados SSL reais do Let's Encrypt
# Use este script quando o domínio estiver apontando corretamente e quiser substituir os certificados auto-assinados

set -e

echo "🔐 Obtendo certificados SSL reais do Let's Encrypt..."
echo "⚠️ ATENÇÃO: Este script vai substituir os certificados auto-assinados atuais"
echo "📝 Certifique-se de que:"
echo "   - O domínio anotandotcc.shop aponta para este servidor"
echo "   - As portas 80 e 443 estão abertas"
echo "   - Não há firewall bloqueando as conexões"
echo ""

read -p "Deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operação cancelada"
    exit 1
fi

# Parar nginx temporariamente
echo "⏹️ Parando nginx temporariamente..."
sudo docker-compose -f docker-compose.prod.yml stop nginx

# Tentar obter certificados usando modo standalone
echo "🔐 Solicitando certificados SSL..."
sudo docker-compose -f docker-compose.prod.yml run --rm --service-ports certbot certonly \
    --standalone \
    --email gugzribeiro@gmail.com \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d anotandotcc.shop \
    -d www.anotandotcc.shop

# Reiniciar nginx
echo "🚀 Reiniciando nginx..."
sudo docker-compose -f docker-compose.prod.yml up -d nginx

echo "✅ Certificados SSL reais obtidos com sucesso!"
echo "🌐 Sua aplicação agora está rodando com certificados válidos em:"
echo "   🔒 https://anotandotcc.shop"
echo "   🔒 https://www.anotandotcc.shop"
