#!/bin/bash

# Script para configurar renovação automática de certificados SSL
# Execute este script após obter os certificados pela primeira vez

set -e

echo "⚙️ Configurando renovação automática de SSL..."

# Caminho para o diretório do projeto
PROJECT_DIR="/home/pietro.araujo2/Anotando"

# Criar entrada no crontab para renovar certificados a cada 12 horas
CRON_JOB="0 */12 * * * cd $PROJECT_DIR && ./scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1"

# Verificar se o cron job já existe
if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
    # Adicionar ao crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job adicionado com sucesso!"
    echo "📋 Certificados serão verificados para renovação a cada 12 horas"
else
    echo "ℹ️ Cron job já existe"
fi

echo ""
echo "📋 Para ver o crontab atual: crontab -l"
echo "📋 Para ver logs de renovação: tail -f /var/log/ssl-renew.log"
