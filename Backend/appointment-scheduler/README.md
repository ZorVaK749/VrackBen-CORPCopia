# ms-appointment-scheduler — Agendamiento de Citas

Microservicio que gestiona las citas de los clientes en el taller.

## Stack
- Spring Boot + Spring Data JPA + PostgreSQL
- **Eureka Name:** `ms-appointment-scheduler`
- **Ruta Gateway:** `/api/appointments/**`

## Funcionalidad

Permite a los clientes agendar una cita en el taller indicando:
- Fecha y hora deseada
- Tipo de servicio requerido
- Datos del vehículo

## Integración

La vista `/agendar` del frontend se conecta a este servicio para:
- Consultar disponibilidad de horarios
- Registrar una nueva cita
- Ver citas existentes del cliente

## Docker
```bash
docker-compose build ms-appointment-scheduler
docker-compose up -d ms-appointment-scheduler
```
