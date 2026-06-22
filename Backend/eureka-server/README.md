# Eureka Server — Service Discovery

Servidor de descubrimiento de servicios basado en **Netflix Eureka**. Todos los microservicios de VraKBen-CORP se registran aquí al arrancar, permitiendo que el API Gateway los resuelva por nombre lógico en vez de IP:puerto.

## Stack

- **Spring Boot**
- **Spring Cloud Netflix Eureka Server**
- **Puerto:** `8761`

## Panel Web

Una vez levantado, accede al dashboard de Eureka en:
**http://localhost:8761**

Aquí podrás ver qué microservicios están registrados y en qué instancia están corriendo.

## Docker

```bash
# Se levanta automáticamente con el stack completo
docker-compose up -d eureka-server

# Ver logs
docker-compose logs -f eureka-server
```

## ¿Por qué Eureka?

En una arquitectura de microservicios, las instancias pueden cambiar de IP dinámicamente (especialmente en Docker). En vez de hardcodear `http://auth-server:8083`, el API Gateway consulta a Eureka con `lb://ms-auth-server` y obtiene la IP/puerto actual automáticamente. Esto también permite balanceo de carga si hay múltiples instancias del mismo servicio.
