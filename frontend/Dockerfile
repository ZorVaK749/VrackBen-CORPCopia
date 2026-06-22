# =============================================================
# VraKBen Frontend Lite — Dockerfile
# Multi-stage build:
#   Stage 1 (builder): Node 20 Alpine — instala deps y hace build Vite
#   Stage 2 (runner):  Nginx Alpine — sirve los estáticos generados
# Imagen final estimada: ~25 MB
#
# IMPORTANTE — Vite y las variables de entorno:
#   Las variables VITE_* se "queman" en el bundle en tiempo de build,
#   NO en tiempo de ejecución del contenedor. Por eso se pasan como
#   ARG en el Dockerfile y se declaran como ENV antes de npm run build.
#
# Uso:
#   docker build \
#     --build-arg VITE_API_BACKEND_URL=http://<tu-alb-backend> \
#     -t vrakben-frontend:lite .
# =============================================================

# ──────────────────────────────────────────
# STAGE 1: BUILD
# ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos primero para aprovechar la caché de Docker.
# Si package.json no cambia, npm ci no re-instala todo.
COPY package.json package-lock.json ./
RUN npm ci --silent

# ARG recibe el valor en tiempo de build (--build-arg)
# ENV lo expone al proceso de npm run build para que Vite lo use
ARG VITE_API_BACKEND_URL=http://localhost:8084
ENV VITE_API_BACKEND_URL=$VITE_API_BACKEND_URL

# Copiar el resto del código fuente
COPY . .

# Generar los estáticos optimizados en /app/dist
RUN npm run build

# ──────────────────────────────────────────
# STAGE 2: RUNTIME
# ──────────────────────────────────────────
FROM nginx:alpine AS runner

# Eliminar la configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/conf.d/default.conf

# Copiar el build de React desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto estándar HTTP (ALB del ECS debe apuntar al puerto 80)
EXPOSE 80

# Health check para ECS
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
