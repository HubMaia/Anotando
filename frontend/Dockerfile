# Dockerfile para o frontend React
FROM node:18 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Debug: List contents of public directory
RUN ls -la public/

# Build the app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
