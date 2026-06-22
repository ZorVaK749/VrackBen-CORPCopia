# INFORME TÉCNICO DE INFRAESTRUCTURA Y DESPLIEGUE CLOUD

**Proyecto:** Solución Arquitectónica Innovatech (VraKBen Lite)

**Plataforma:** AWS ECS (Fargate) & GitHub Actions

**Fecha:** 22 de junio de 2026

**Estado:** Fase Final de Estabilización

---

## 1. Resumen Ejecutivo

Durante el proceso de despliegue automatizado de la arquitectura multicapa (Frontend y Backend) en **Amazon ECS (Fargate)** a través de **GitHub Actions**, se presentaron múltiples fallos en cadena que impidieron la disponibilidad de la plataforma, manifestándose de cara al usuario mediante un error **`504 Gateway Time-out`**.

Este informe recopila formalmente los diagnósticos realizados, las soluciones de código y arquitectura implementadas junto al componente de IA (Antigravity), y el cuello de botella final detectado a nivel de firewalls (Security Groups) en AWS.

---

## 2. Definición de la Infraestructura Afectada

* **Clúster ECS:** `cluster-innovatech1`
* **Orquestador/Modo de Red:** AWS Fargate / `awsvpc`
* **Servicio Backend:** `tarea-back-service-kvwylxa6`
* **Servicio Frontend:** `tarea-front-service-m6bwygj2`
* **Enrutador:** Application Load Balancer (ALB) apuntando al puerto **80**

---

## 3. Cronología de Incidentes, Diagnósticos y Resoluciones

### Fase 1: Desfase de Nombres en el Pipeline de CI/CD

* **Incidente:** Los cambios en los archivos de configuración no se reflejaban en AWS al realizar commits en la rama `main`.
* **Diagnóstico:** Al reconstruir los servicios en la consola de AWS, los identificadores hash cambiaron, provocando que los flujos de GitHub Actions apuntaran a nombres de servicios inexistentes.
* **Resolución:** Se actualizaron los workflows de GitHub (`.github/workflows/deploy-back.yml` y `deploy-front.yml`) alineando los parámetros de despliegue con los nombres reales de los servicios activos.

### Fase 2: Colapso del Contenedor en Arranque (`Exit Code: 1`)

* **Incidente:** El servicio de backend se mantenía de forma persistente en estado `0/1 Tasks running`.
* **Diagnóstico de Logs:** El análisis de logs de CloudWatch reveló un fallo crítico de inicialización en el framework Spring Boot (`BeanCreationException`):
> `Failed to execute SQL script statement #1 of URL [.../data.sql]: INSERT INTO catalog_products...`
> *A partir de Spring Boot 2.5+, la ejecución del script `data.sql` ocurre de forma nativa antes de que Hibernate genere las tablas mediante la propiedad `ddl-auto`. Al no existir la tabla `catalog_products`, el contenedor moría instantáneamente.*

* **Resolución:** Se inyectaron configuraciones de diferimiento en el archivo `application.yml`:
```yaml
spring:
  jpa:
    defer-datasource-initialization: true
    hibernate:
      ddl-auto: update
```

### Fase 3: Conflicto de Mapeo de Puertos (ALB vs. Container)
*   **Incidente:** El contenedor logró mantenerse en ejecución estable (`1/1 Tasks running`), pero el balanceador de carga continuaba respondiendo con error 504.
*   **Diagnóstico:** La infraestructura de AWS (Target Groups) derivaba el tráfico HTTP por el puerto **80**, mientras que la aplicación Spring Boot levantaba internamente bajo su puerto por defecto (**8080/8084**).
*   **Resolución:** Se modificó el ecosistema del backend para estandarizar el puerto de escucha:
    *   **`application.yml`:** Se configuró `server.port: 80`.
    *   **`Dockerfile`:** Se modificó la instrucción de exposición a `EXPOSE 80`.
    *   **`CatalogService.java`:** Se actualizaron los valores `@Value` correspondientes a la URL de red.

### Fase 4: Rechazo de Health Checks y Activación del Circuit Breaker
*   **Incidente:** GitHub Actions fallaba en el paso *Deploy Amazon ECS task definition* tras 5 minutos de espera. AWS ECS aplicaba un `Rollback successful` a la versión anterior.
*   **Diagnóstico:** El Application Load Balancer realiza por defecto sus chequeos de salud (pings) hacia la ruta raíz (`/`). Debido a que el backend expone únicamente endpoints bajo el prefijo `/api/...`, Spring Boot respondía con un código `404 Not Found`. Al no recibir un código de éxito (`200 OK`), AWS asumía el fallo del contenedor y disparaba el disyuntor de despliegue (*Circuit Breaker*).
*   **Resolución:** 
    *   Se desarrolló e incorporó la clase `RootController.java` mapeada a la ruta raíz (`/`) para forzar una respuesta HTTP `200 OK` explícita para el balanceador.
    *   Se ajustó el comando `HEALTHCHECK` del `Dockerfile` apuntando estrictamente a la dirección loopback `127.0.0.1:80` para mitigar problemas de resolución IPv6 en entornos Linux Alpine.

---

## 4. Bloqueo Actual y Desviación de Infraestructura

El pipeline de CI/CD y el código fuente se encuentran actualmente **100% optimizados y validados**. El error `504 Gateway Time-out` remanente responde exclusivamente a un aislamiento de red en la nube de AWS.

### Hallazgo Técnico:
Durante la última intervención en la consola, se detectó una confusión en la capa de seguridad periférica. Se modificaron las reglas de entrada (`Inbound rules`) del **Security Group del Load Balancer (`sgalb-innovatech`)** para permitir el tráfico `0.0.0.0/0`. Sin embargo, el **Security Group propio de la tarea ECS (Fargate)** permanece cerrado, bloqueando las solicitudes que el ALB le envía.

---

## 5. Plan de Acción Inmediato (Paso Final de Cierre)

Para dar de alta el entorno y restablecer el tráfico total de la aplicación, es imperativo ejecutar el siguiente procedimiento en la consola de AWS:

1.  **Localizar el Firewall del Contenedor:** Ingresar a **Amazon ECS** > Clúster `cluster-innovatech1` > Servicio `tarea-back-service-kvwylxa6`.
2.  **Identificar el Grupo de Seguridad:** En la pestaña **Configuration and networking**, ubicar la sección de red y hacer clic sobre el ID de **Security Group de la tarea** (un identificador único que difiere del grupo del ALB).
3.  **Habilitar Entrada HTTP:**
    *   Hacer clic en **Edit inbound rules**.
    *   Añadir una regla con tipo **HTTP** (Puerto 80).
    *   Establecer el origen (*Source*) como **Anywhere-IPv4** (`0.0.0.0/0`) o, preferiblemente, asociar el ID del `sgalb-innovatech` para restringir el acceso solo al balanceador.
4.  **Confirmación:** Guardar los cambios (`Save rules`) y ejecutar un **Re-run** manual del job en GitHub Actions.

---

## 6. Protocolo de Mitigación de Costos (AWS Academy)

A fin de salvaguardar el presupuesto asignado de USD 50 y prevenir la suspensión de la cuenta de laboratorio antes de la evaluación, se ratifica el protocolo de congelación una vez verificado el funcionamiento del enlace web:

*   **Puesta en pausa:** Modificar el parámetro **Desired tasks** a `0` en los servicios de Front y Back dentro de ECS.
*   **Cierre de sesión seguro:** Detener por completo el laboratorio desde la consola de Vocareum utilizando la opción **End Lab**.
