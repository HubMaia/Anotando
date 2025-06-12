# Dockerfile para o frontend React
FROM node:18 AS build
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy all files from frontend directory
COPY frontend/ .

# Build the app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração customizada do nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
