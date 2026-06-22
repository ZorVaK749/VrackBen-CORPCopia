# ms-auth-server — Autenticación y Usuarios

Microservicio responsable de la autenticación de usuarios, generación de tokens JWT y gestión de cuentas en VraKBen-CORP.

## Stack

- **Spring Boot 4.0.3**
- **Spring Security**
- **Spring Data JPA** + **PostgreSQL**
- **JWT** (jjwt 0.11.5)
- **Puerto:** `8083`
- **Eureka Name:** `ms-auth-server`

## Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login. Recibe `{username, password}`, retorna `{token, username, roles, name}` | ❌ |
| `POST` | `/api/auth/register` | Registro. Recibe `{username, password, name, roles}` | ❌ |
| `GET` | `/api/auth/users/{username}` | Busca un usuario por username (uso admin) | ✅ JWT |

## Roles Disponibles

| Valor en BD | Rol en JWT | Descripción |
|---|---|---|
| `USER` | `CLIENTE` | Cliente del taller |
| `MECANICO` | `MECANICO` | Mecánico del taller |
| `ADMIN` | `ADMIN` | Administrador del sistema |

## Configuración

```yaml
# application.yml (en contenedor Docker, la BD se sobreescribe por variables de entorno)
server:
  port: 8083
spring:
  application:
    name: ms-auth-server
  datasource:
    url: jdbc:postgresql://vrakben-db:5432/vrakben_db
    username: user_vrakben
    password: password_vrakben
  jpa:
    hibernate:
      ddl-auto: update
```

## Usuarios de Prueba

| Nombre | Email/Username | Contraseña | Rol |
|---|---|---|---|
| Vicente Placencia | vicente.placet@gmail.com | Placencia.749 | ADMIN |
| Jorge Barría | — | — | MECANICO |
| Matias Espinoza | — | — | CLIENTE |

## Docker

```bash
# Reconstruir y reiniciar solo este servicio
docker-compose build auth-server
docker-compose up -d auth-server

# Ver logs
docker-compose logs -f auth-server
```
