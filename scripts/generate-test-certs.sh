#!/bin/bash

# Script para gerar certificados auto-assinados para teste local
# Use apenas para desenvolvimento/teste

set -e

echo "🔧 Gerando certificados auto-assinados para teste..."

# Criar diretório para certificados de teste
mkdir -p ./certbot/conf/live/anotandotcc.shop

# Gerar certificados auto-assinados
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./certbot/conf/live/anotandotcc.shop/privkey.pem \
    -out ./certbot/conf/live/anotandotcc.shop/fullchain.pem \
    -subj "/C=BR/ST=State/L=City/O=Organization/CN=anotandotcc.shop"

# Ajustar permissões
sudo chmod 644 ./certbot/conf/live/anotandotcc.shop/fullchain.pem
sudo chmod 600 ./certbot/conf/live/anotandotcc.shop/privkey.pem

echo "✅ Certificados auto-assinados criados!"
echo "⚠️ ATENÇÃO: Estes são certificados de TESTE - para produção use Let's Encrypt"
