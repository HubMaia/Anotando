#!/bin/bash

# Script para renovar certificados SSL automaticamente
# Pode ser executado em cron para renovação automática

set -e

echo "🔄 Renovando certificados SSL..."

# Tentar renovar certificados
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Recarregar nginx se os certificados foram renovados
if [ $? -eq 0 ]; then
    echo "📋 Recarregando configuração do nginx..."
    docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
    echo "✅ Certificados renovados e nginx recarregado!"
else
    echo "ℹ️ Nenhum certificado precisou ser renovado."
fi
