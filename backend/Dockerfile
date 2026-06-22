# =============================================================
# VraKBen Catalog Lite — Dockerfile (Backend)
# Multi-stage build:
#   Stage 1 (builder): Compila el .jar con Maven
#   Stage 2 (runner):  Imagen mínima con solo el JRE para ejecutar
# Imagen final estimada: ~180 MB
# =============================================================

# ──────────────────────────────────────────
# STAGE 1: BUILD
# ──────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copiar pom.xml primero para aprovechar la caché de Docker.
# Si el pom.xml no cambia, Maven no re-descarga dependencias.
COPY pom.xml .
RUN mvn dependency:go-offline -B --quiet

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn package -DskipTests -B --quiet

# ──────────────────────────────────────────
# STAGE 2: RUNTIME
# ──────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runner

# Crear usuario sin privilegios para mayor seguridad en Fargate
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copiar únicamente el .jar generado desde el stage anterior
COPY --from=builder /build/target/*.jar app.jar

# Directorio para uploads de imágenes (efímero en Fargate)
RUN mkdir -p /tmp/catalog-uploads

# Puerto que expone el microservicio (debe coincidir con server.port)
EXPOSE 80

# Health check para ECS — usa el endpoint de Actuator
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/actuator/health || exit 1

# Variables de entorno configurables desde ECS Task Definition
ENV JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseContainerSupport"
ENV FRONTEND_ORIGIN="*"
ENV BACKEND_PUBLIC_URL="http://localhost:80"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
