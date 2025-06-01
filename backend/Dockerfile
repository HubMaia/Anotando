# Dockerfile para o backend Node.js
FROM node:18
WORKDIR /app

# Copia os arquivos package.json e package-lock.json da pasta backend do host
# para o WORKDIR /app do container.
COPY backend/package*.json ./ 

# Limpa o cache do npm e instala as dependências.
RUN npm cache clean --force && npm install

# Copia o restante dos arquivos da pasta backend do host para o WORKDIR /app do container.
COPY backend/. . 

EXPOSE 3000
CMD ["node", "server.js"]