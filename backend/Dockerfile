# Dockerfile para o backend Node.js
FROM node:18-alpine

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Mudar proprietário do diretório de trabalho
RUN chown nodejs:nodejs /app
USER nodejs

# Copia apenas os arquivos de dependências primeiro (para otimizar cache)
COPY --chown=nodejs:nodejs backend/package*.json ./

# Instala as dependências
RUN npm ci --only=production --silent

# Copia o código da aplicação
COPY --chown=nodejs:nodejs backend/ ./

# Verificação final
RUN node -e "console.log('Node version:', process.version); try { require('express'); console.log('✅ Express loaded successfully'); } catch(e) { console.log('❌ Express error:', e.message); process.exit(1); }"

EXPOSE 3000

# Comando simples para iniciar o servidor
CMD ["node", "server.js"]