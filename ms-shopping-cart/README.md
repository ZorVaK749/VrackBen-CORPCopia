# ms-shopping-cart — Carrito de Compras

Microservicio que gestiona el carrito de compras de los clientes del taller.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **Eureka Name:** `ms-shopping-cart`
- **Ruta Gateway:** `/api/cart/**`

## Endpoints (a través del Gateway)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/cart/add` | Añade un item al carrito |
| `GET` | `/api/cart/{customerRut}` | Obtiene el carrito del cliente |
| `DELETE` | `/api/cart/remove/{itemId}` | Elimina un item del carrito |

## Docker
```bash
docker-compose build ms-shopping-cart
docker-compose up -d ms-shopping-cart
```
