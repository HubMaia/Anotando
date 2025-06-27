#!/bin/bash

# Script principal para deploy com SSL
# Este script configura tudo do zero

set -e

echo "🚀 Iniciando deploy com SSL..."

# Verificar se é a primeira vez (sem certificados)
if [ ! -d "./certbot/conf/live/anotandotcc.shop" ]; then
    echo "📋 Primeira execução detectada - configurando SSL do zero..."
    
    # Usar configuração sem SSL primeiro
    echo "🔧 Copiando configuração temporária do nginx..."
    cp nginx/conf/default-no-ssl.conf nginx/conf/default.conf
    
    # Iniciar serviços sem SSL
    echo "🐳 Iniciando containers..."
    sudo docker-compose -f docker-compose.prod.yml up -d
    
    # Aguardar serviços iniciarem
    echo "⏳ Aguardando serviços iniciarem..."
    sleep 30
    
    # Obter certificados SSL
    echo "🔐 Obtendo certificados SSL..."
    sudo docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email gugzribeiro@gmail.com \
        --agree-tos \
        --no-eff-email \
        -d anotandotcc.shop \
        -d www.anotandotcc.shop
    
    # Restaurar configuração com SSL
    echo "🔧 Aplicando configuração SSL..."
    git checkout nginx/conf/default.conf || cp nginx/conf/default.conf.backup nginx/conf/default.conf 2>/dev/null || echo "⚠️ Usando configuração SSL padrão"
    
    # Recarregar nginx
    echo "🔄 Recarregando nginx..."
    sudo docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
    
    echo "✅ Deploy com SSL concluído!"
else
    echo "🔄 Certificados SSL já existem - iniciando normalmente..."
    sudo docker-compose -f docker-compose.prod.yml up -d
    echo "✅ Deploy concluído!"
fi

echo ""
echo "🌐 Sua aplicação está rodando em:"
echo "   🔒 https://anotandotcc.shop"
echo "   🔒 https://www.anotandotcc.shop"
echo ""
echo "📋 Para ver os logs: sudo docker-compose -f docker-compose.prod.yml logs -f"
echo "🔄 Para renovar SSL: ./scripts/renew-ssl.sh"
