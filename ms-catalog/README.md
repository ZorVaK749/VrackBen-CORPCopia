# ms-catalog — Catálogo de Repuestos

Microservicio encargado del catálogo de productos/repuestos del taller. Gestiona los metadatos de cada producto (nombre, precio, imagen, descripción). El stock físico lo maneja `ms-stock-engine`.

## Stack

- **Spring Boot**
- **Spring Data JPA** + **PostgreSQL**
- **Redis 7** (Caché en memoria)
- **Puerto:** `8084`
- **Eureka Name:** `ms-catalog`

## Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/catalog/all` | Lista todos los productos del catálogo | ✅ JWT |
| `GET` | `/api/catalog/{sku}` | Obtiene un producto por su SKU | ✅ JWT |
| `POST` | `/api/catalog/create` | Crea un nuevo producto | ✅ JWT |

## Modelo de Datos — `ProductCatalog`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | ID autogenerado |
| `sku` | String | Código único del producto (ej: `TOY-OIL-001`) |
| `name` | String | Nombre del producto |
| `brand` | String | Marca |
| `category` | String | Categoría |
| `description` | String | Descripción |
| `price` | Double | Precio en CLP |
| `imageUrl` | String | URL de la imagen del producto |

## Ejemplo: Crear Producto

```json
POST /api/catalog/create
{
  "sku": "TOY-OIL-001",
  "name": "Filtro de Aceite Toyota",
  "brand": "Toyota",
  "category": "Filtros",
  "description": "Filtro original para motores 1NZ-FE",
  "price": 12990,
  "imageUrl": "https://ejemplo.com/filtro.jpg"
}
```

## Docker

```bash
docker-compose build ms-catalog
docker-compose up -d ms-catalog
docker-compose logs -f ms-catalog
```
