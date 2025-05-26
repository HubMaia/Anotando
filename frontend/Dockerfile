# Dockerfile para o frontend React + Apache2
FROM node:18 as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM ubuntu:22.04
RUN apt-get update && apt-get install -y apache2 && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/build/ /var/www/html/
EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]
