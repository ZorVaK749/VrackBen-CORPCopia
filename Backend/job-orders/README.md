# ms-job-orders — Órdenes de Trabajo

Microservicio que gestiona las órdenes de trabajo asignadas a los mecánicos del taller.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **Eureka Name:** `ms-job-orders`
- **Ruta Gateway:** `/api/jobs/**`

## Modelo Conceptual

Una Orden de Trabajo (OT) representa un trabajo asignado a un mecánico para un vehículo específico:
- ID de orden (ej: `OT-1001`)
- Vehículo asociado (marca, modelo, año, patente)
- Mecánico asignado
- Estado: `PENDING` / `IN_PROGRESS` / `COMPLETED`
- Tiempo estimado y real

## Integración Futura

El panel del mecánico (`/mecanico/dashboard`) debe conectarse a este servicio para mostrar las órdenes reales en vez de datos hardcodeados.

## Docker
```bash
docker-compose build ms-job-orders
docker-compose up -d ms-job-orders
```
