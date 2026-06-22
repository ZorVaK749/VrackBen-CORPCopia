# ms-order-management — Gestión de Órdenes de Venta

Microservicio que gestiona las órdenes de compra/venta de repuestos realizadas por los clientes.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **RabbitMQ** (Mensajería Asíncrona)
- **Feign Client** (Comunicación Síncrona)
- **Eureka Name:** `ms-order-management`
- **Ruta Gateway:** `/api/orders/**`

## Funcionalidad

Maneja el ciclo de vida de una orden de venta:
1. Recibe la orden de compra desde el Frontend.
2. Descuenta el stock en tiempo real vía **Feign Client** hacia `ms-stock-engine`.
3. Persiste la orden (`COMPLETED` o `FAILED - NO STOCK`).
4. Publica el evento `OrderEvent` asíncronamente en **RabbitMQ** (`vrakben.exchange`).
5. Un consumer asíncrono simula el envío de una notificación por email.

## Integración Futura

- La vista `/pago` del frontend debe integrarse con este servicio para procesar compras.
- Ideal: integración con Transbank (WebPay) para el mercado chileno.

## Docker
```bash
docker-compose build ms-order-management
docker-compose up -d ms-order-management
```
