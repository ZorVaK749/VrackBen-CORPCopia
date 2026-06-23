# Etapa 1: Construcción (Node.js 22 compila el código de React/Vite)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx sirve los archivos compilados)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Esta línea configura Nginx para que no rompa las rutas de React (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]