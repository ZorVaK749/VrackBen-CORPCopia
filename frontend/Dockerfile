# Etapa 1: Construcción (Node.js 22 compila el código de React/Vite)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# La variable VITE_API_BASE_URL se inyecta en tiempo de build para que
# Vite la embeba en el bundle estático (no se puede cambiar en runtime).
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Etapa 2: Servidor Web (Nginx sirve los archivos compilados)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Se copia la configuración personalizada de Nginx (con el proxy_pass al BFF)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
