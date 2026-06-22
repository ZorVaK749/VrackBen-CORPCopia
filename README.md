# VraKBen Lite — AWS Academy ECS Edition

Esta es una versión simplificada ("Lite") del proyecto original VraKBen-CORP. Fue diseñada específicamente para ser desplegada en los laboratorios de **AWS Academy** utilizando **AWS ECS con Fargate**, adaptándose a los estrictos límites de créditos y memoria.

## Arquitectura Lite

La arquitectura original de 9 microservicios, bases de datos externas, Redis, y Eureka, ha sido reducida a solo 2 componentes completamente independientes:

1. **Frontend (`/frontend`)**
   - Aplicación React (Vite) servida por Nginx Alpine.
   - Enrutamiento SPA configurado.
   - Conexión directa al backend mediante la variable `VITE_API_BACKEND_URL`.

2. **Backend (`/backend`)**
   - Microservicio `ms-catalog` aislado.
   - Base de datos H2 en memoria (sin necesidad de PostgreSQL externo).
   - Dependencias de Eureka y Redis eliminadas.
   - Datos mockeados cargados automáticamente al inicio (`data.sql`).
   - Soporte para CORS desde el frontend.

## Despliegue CI/CD (GitHub Actions)

El repositorio cuenta con dos flujos de trabajo (workflows) separados para el frontend y el backend, configurados para AWS Academy:

- `.github/workflows/deploy-front.yml`: Se ejecuta solo cuando hay cambios en la carpeta `frontend/`.
- `.github/workflows/deploy-back.yml`: Se ejecuta solo cuando hay cambios en la carpeta `backend/`.

### Secretos de GitHub requeridos

Para que los workflows funcionen correctamente, debes configurar los siguientes "Repository Secrets" en GitHub:

- `AWS_ACCESS_KEY_ID`: Tu Access Key de AWS Academy.
- `AWS_SECRET_ACCESS_KEY`: Tu Secret Access Key.
- `AWS_SESSION_TOKEN`: **Obligatorio** en entornos de AWS Academy.
- `VITE_API_BACKEND_URL`: La URL pública del Application Load Balancer (ALB) de tu backend en ECS (necesario solo para el build del frontend).

_Nota sobre AWS Academy: Recuerda que las credenciales rotan frecuentemente. Deberás actualizarlas en GitHub antes de cada sesión de despliegue_

## Ejecución Local con Docker

Puedes probar ambos servicios localmente antes de desplegarlos:

### Backend

```bash
cd backend
docker build -t vrakben-backend:lite .
docker run -p 8084:8084 vrakben-backend:lite
```

_(El backend responderá en http://localhost:8084/api/catalog/all)_

### Frontend

```bash
cd frontend
docker build --build-arg VITE_API_BACKEND_URL=http://localhost:8084 -t vrakben-frontend:lite .
docker run -p 80:80 vrakben-frontend:lite
```

_(El frontend estará disponible en http://localhost)_
