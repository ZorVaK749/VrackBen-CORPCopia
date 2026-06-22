# ms-vehicle-history — Historial de Vehículos

Microservicio que gestiona el historial de reparaciones e intervenciones por vehículo.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **Eureka Name:** `ms-vehicle-history`
- **Ruta Gateway:** `/api/history/**`

## Funcionalidad

Registra el historial completo de un vehículo:
- Reparaciones realizadas
- Repuestos utilizados
- Mecánico que realizó el trabajo
- Fecha y kilometraje

## Integración Futura

- El perfil del cliente (`/perfil`) debe mostrar el historial de sus vehículos.
- El panel del mecánico debe registrar intervenciones al completar una orden de trabajo.

## Docker
```bash
docker-compose build ms-vehicle-history
docker-compose up -d ms-vehicle-history
```
