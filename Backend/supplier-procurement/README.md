# ms-supplier-procurement — Solicitudes de Material

Microservicio que gestiona las solicitudes de materiales/repuestos realizadas por los mecánicos al área de proveedores/administración.

## Stack

- **Spring Boot**
- **Spring Data JPA** + **PostgreSQL**
- **Puerto interno:** `8080` | **Puerto expuesto:** `8088`
- **Eureka Name:** `ms-supplier-procurement`

## Endpoints

| Método | Ruta | Descripción | Actor |
|---|---|---|---|
| `POST` | `/api/procurement/order` | Crea una solicitud de material | Mecánico |
| `GET` | `/api/procurement/all` | Lista todas las solicitudes | Admin |
| `PUT` | `/api/procurement/status/{id}?status=X` | Actualiza estado de solicitud | Admin |

## Estados de una Solicitud

```
PENDING → APPROVED
         ↘ REJECTED
```

## Modelo de Datos — `SupplierOrder`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | ID autogenerado |
| `productSku` | String | SKU del repuesto solicitado |
| `quantity` | Integer | Cantidad solicitada |
| `status` | String | `PENDING`, `APPROVED`, `REJECTED` |
| `orderDate` | DateTime | Fecha/hora de la solicitud |

## Ejemplo: Crear Solicitud (Mecánico)

```json
POST /api/procurement/order
Authorization: Bearer {token}
{
  "productSku": "TOY-OIL-001",
  "quantity": 10
}
```

## Docker

```bash
docker-compose build ms-supplier-procurement
docker-compose up -d ms-supplier-procurement
docker-compose logs -f ms-supplier-procurement
```
