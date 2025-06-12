# Dockerfile para o backend Node.js
FROM node:18
WORKDIR /app

# Copia os arquivos package.json e package-lock.json da pasta backend do host
# para o WORKDIR /app do container.
COPY backend/package*.json ./ 

# Limpa o cache do npm e instala as dependências com verbose para debug
RUN npm cache clean --force
RUN npm install --verbose --no-optional

# Verifica se as dependências foram instaladas
RUN ls -la node_modules/

# Copia o restante dos arquivos da pasta backend do host para o WORKDIR /app do container.
COPY backend/. . 

# Verifica se o express foi instalado
RUN ls -la node_modules/express/ || echo "Express não encontrado!"

EXPOSE 3000
CMD ["node", "server.js"]