# ms-stock-engine — Motor de Inventario

Microservicio que gestiona el stock físico de repuestos en bodega. Complementa a `ms-catalog`: el catálogo guarda los datos del producto, el stock-engine guarda la cantidad disponible.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **Eureka Name:** `ms-stock-engine`
- **Ruta Gateway:** `/api/stock/**`

## Rol en el Sistema

- Cuando se aprueba una solicitud de procurement, el stock debería incrementarse.
- Cuando se usa un repuesto en una orden de trabajo, el stock debería decrementarse.
- El panel de inventario del mecánico (`/mecanico/inventario`) consulta este servicio.

## Docker
```bash
docker-compose build ms-stock-engine
docker-compose up -d ms-stock-engine
```
