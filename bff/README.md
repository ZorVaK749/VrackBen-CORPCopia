# BFF — API Gateway (VraKBen-CORP)

Este módulo es el **punto único de entrada** de toda la arquitectura VraKBen-CORP. Actúa como:
- **API Gateway:** Enruta cada petición HTTP al microservicio correspondiente según el path.
- **BFF (Backend For Frontend):** Adaptado para servir únicamente al frontend React.
- **Validador JWT:** Verifica el token de autenticación en cada ruta protegida antes de dejar pasar la petición.

## Stack

- **Spring Boot 3.4.0**
- **Spring Cloud Gateway 2024.0.0** (WebFlux / reactivo)
- **Spring Cloud Netflix Eureka Client** (Service Discovery)
- **JWT** (jjwt 0.11.5)
- **Puerto:** `8080`

> ⚠️ **Importante:** Este BFF usa Spring Boot **3.4.0**. No actualizar a 4.x sin verificar compatibilidad con Spring Cloud Gateway.

## Rutas Configuradas

| ID | Path | Microservicio Destino | JWT Requerido |
|---|---|---|---|
| `auth-server-route` | `/api/auth/**` | `lb://ms-auth-server` | ❌ No |
| `catalog-route` | `/api/catalog/**` | `lb://ms-catalog` | ✅ Sí |
| `stock-engine-route` | `/api/stock/**` | `lb://ms-stock-engine` | ✅ Sí |
| `supplier-procurement-route` | `/api/procurement/**` | `lb://ms-supplier-procurement` | ✅ Sí |
| `job-orders-route` | `/api/jobs/**` | `lb://ms-job-orders` | ✅ Sí |
| `shopping-cart-route` | `/api/cart/**` | `lb://ms-shopping-cart` | ✅ Sí |
| `appointment-route` | `/api/appointments/**` | `lb://ms-appointment-scheduler` | ✅ Sí |
| `vehicle-history-route` | `/api/history/**` | `lb://ms-vehicle-history` | ✅ Sí |

> Las URIs usan el prefijo `lb://` para resolución via Eureka (load balancing automático).

## Componentes Clave

### `JwtAuthenticationGatewayFilterFactory.java`
Filtro personalizado de Spring Cloud Gateway. Para cada ruta marcada con `- JwtAuthentication`:
1. Extrae el header `Authorization: Bearer {token}`
2. Valida el token usando `JwtUtil`
3. Si es válido: añade el header `loggedInUser: {username}` y deja pasar la petición
4. Si es inválido/ausente: retorna `401 Unauthorized`

### `CorsConfig.java`
Configuración CORS global con `CorsWebFilter`. Permite peticiones desde:
- `http://localhost:5173` (frontend Vite en desarrollo)
- `http://localhost:3000` (alternativo)

Métodos permitidos: `GET, POST, PUT, DELETE, OPTIONS`

Headers permitidos: `Authorization, Content-Type, Accept`

## Cómo Levantar

El gateway se levanta junto con todo el stack vía Docker Compose desde la raíz del proyecto:
```bash
docker-compose up --build -d api-gateway
```

O para reconstruir solo este servicio después de cambios:
```bash
docker-compose build api-gateway
docker-compose up -d api-gateway
```
