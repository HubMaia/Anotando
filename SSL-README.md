# Configuração SSL com Certbot, Nginx e Docker

Esta documentação explica como configurar SSL/HTTPS para sua aplicação usando Let's Encrypt, Nginx e Docker.

## 🎉 Status Atual

✅ **SSL configurado com sucesso!**
- HTTPS funcionando com certificados auto-assinados
- Redirecionamento HTTP → HTTPS ativo
- Proxy reverso configurado corretamente
- Aplicação React sendo servida via HTTPS

## 🚀 Para Acessar

**Localmente (para testes):**
```bash
# HTTP (redireciona para HTTPS)
curl -H "Host: anotandotcc.shop" http://localhost

# HTTPS (certificado auto-assinado)
curl -k -H "Host: anotandotcc.shop" https://localhost
```

**Publicamente:**
- 🔒 https://anotandotcc.shop
- 🔒 https://www.anotandotcc.shop

## 🔐 Certificados SSL

**Certificados Atuais:** Auto-assinados (para teste)
**Para obter certificados reais do Let's Encrypt:**
```bash
./scripts/get-real-ssl.sh
```

## 🚀 Deploy Inicial (Primeira vez)

### Opção 1: Script Automático (Recomendado)
```bash
# Execute o script de deploy automático
./deploy-with-ssl.sh
```

### Opção 2: Passo a Passo Manual

1. **Configure o email no script**:
   ```bash
   # Edite o arquivo scripts/obtain-ssl.sh
   # Altere: pietro.araujo2@example.com para seu email real
   nano scripts/obtain-ssl.sh
   ```

2. **Obtenha os certificados SSL**:
   ```bash
   ./scripts/obtain-ssl.sh
   ```

3. **Inicie todos os serviços**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔄 Renovação de Certificados

### Manual
```bash
./scripts/renew-ssl.sh
```

### Automática
```bash
# Configure renovação automática (execute apenas uma vez)
./scripts/setup-auto-renewal.sh
```

## 📂 Estrutura de Arquivos

```
nginx/conf/
├── default.conf           # Configuração principal com SSL
└── default-no-ssl.conf   # Configuração temporária sem SSL

scripts/
├── obtain-ssl.sh         # Obter certificados iniciais
├── renew-ssl.sh          # Renovar certificados
└── setup-auto-renewal.sh # Configurar renovação automática

certbot/
├── conf/                 # Certificados SSL
└── www/                  # Desafios do Let's Encrypt
```

## 🔧 Comandos Úteis

### Verificar status dos containers
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Ver logs
```bash
# Todos os serviços
docker-compose -f docker-compose.prod.yml logs -f

# Apenas nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Apenas certbot
docker-compose -f docker-compose.prod.yml logs -f certbot
```

### Recarregar configuração do nginx
```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Verificar certificados
```bash
# Listar certificados
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# Testar renovação (dry-run)
docker-compose -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

### Parar todos os serviços
```bash
docker-compose -f docker-compose.prod.yml down
```

### Rebuild e restart
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ Troubleshooting

### Erro: "Certificate already exists"
Se você tentar obter certificados que já existem:
```bash
# Forçar renovação
docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
```

### Erro de validação de domínio
1. Verifique se o domínio aponta para o servidor correto
2. Certifique-se de que a porta 80 está acessível
3. Verifique os logs do nginx

### Nginx não inicia
1. Verifique a sintaxe da configuração:
   ```bash
   docker-compose -f docker-compose.prod.yml exec nginx nginx -t
   ```
2. Se os certificados não existirem, use a configuração sem SSL primeiro

### Verificar logs de renovação automática
```bash
tail -f /var/log/ssl-renew.log
```

## 🔒 Segurança

- Certificados são renovados automaticamente a cada 12 horas
- HSTS está habilitado para maior segurança
- Protocolos TLS 1.2 e 1.3 apenas
- Headers de segurança configurados

## 🌐 URLs da Aplicação

Após a configuração, sua aplicação estará disponível em:
- 🔒 https://anotandotcc.shop
- 🔒 https://www.anotandotcc.shop

O HTTP (porta 80) redireciona automaticamente para HTTPS (porta 443).
