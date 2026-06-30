# VrakBen - Ecosistema de Microservicios en Kubernetes

Ecosistema de microservicios desarrollado para resolver necesidades empresariales complejas mediante una arquitectura distribuida y altamente escalable. El proyecto orquesta un Frontend (servido en Nginx), un Backend For Frontend (BFF / API Gateway), un Servidor de Autenticación, y múltiples servicios Core implementados en Spring Boot con persistencia en PostgreSQL y caché en Redis. Todo el ecosistema está desplegado de manera declarativa y orquestado 100% en **AWS EKS (Elastic Kubernetes Service)**.

---

## ☁️ Arquitectura Cloud y AWS EKS

La infraestructura base en la nube fue construida desde cero priorizando la segmentación de red y el control absoluto del despliegue:

- **Red VPC Custom:** Se implementó una Virtual Private Cloud (VPC) propia que alberga 4 subredes (2 públicas con auto-asignación IPv4 y 2 privadas) unidas a través de un NAT Gateway, todas correctamente etiquetadas para permitir el _Service Discovery_ de Kubernetes.
- **Registro de Contenedores:** Las imágenes de Docker para cada microservicio son versionadas y almacenadas de manera segura en **Amazon ECR (Elastic Container Registry)**.
- **Clúster EKS (`vrackben-cluster`):** Se provisionó un clúster de Kubernetes prescindiendo del modo "Auto" para mantener un control técnico total sobre la infraestructura. La capacidad computacional está respaldada por Node Groups personalizados, lo que garantiza resiliencia y el aislamiento adecuado de los recursos.

---

## 🛠️ Metodología y Flujo de Trabajo

Para asegurar la calidad y el orden en el ciclo de vida del desarrollo, el equipo adopta metodologías ágiles y estándares de la industria:

### 🌿 GitFlow y Estrategia de Ramas

- `main`: Refleja el estado de producción desplegado en AWS EKS. Solo recibe código funcional e integrado a través de Pull Requests.
- Ramas `feature/*`: Desarrollo de nuevas funcionalidades (ej. `feature/auth-service`).
- Ramas `fix/*` o `chore/*`: Corrección de errores urgentes o ajustes de infraestructura (ej. `chore/backup-ecs-fargate`).

### 📝 Convenciones de Commits (Conventional Commits)

Utilizamos prefijos estandarizados para mantener un historial semántico:

- `feat:` Nuevas funcionalidades (ej. _feat(k8s): add auth manifests_).
- `fix:` Solución de errores (ej. _fix(frontend): add nginx reverse proxy_).
- `ci:` Cambios en la configuración de GitHub Actions.
- `chore:` Tareas de mantenimiento o refactorización.

### 📜 Reglas del Equipo

1. Ningún commit se realiza directamente sobre la rama `main`.
2. Todo el código subido debe pasar por el flujo de CI/CD sin errores en la fase de `build`.
3. Los manifiestos de Kubernetes (`k8s/`) deben mantener el uso de nombres de dominio internos (Services) en lugar de IPs estáticas.

---

## 🚀 Trazabilidad, Calidad y Seguridad (CI/CD)

El despliegue está completamente automatizado a través de pipelines implementados en **GitHub Actions**.

- **Pipeline Unificado:** Cada `push` a la rama `main` dispara el flujo de despliegue continuo (`.github/workflows/deploy-eks.yml`).
- **Integración con AWS:** El pipeline se autentica de forma segura contra AWS utilizando _GitHub Secrets_ (AWS Keys, tokens) sin exponer credenciales en el código fuente.
- **Construcción y Etiquetado Dinámico:** El pipeline compila las imágenes Docker y les asigna dinámicamente como etiqueta el SHA del commit, subiéndolas a Amazon ECR.
- **Despliegue Declarativo:** Mediante comandos `sed`, inyecta la etiqueta dinámica en los manifiestos YAML y ejecuta comandos `kubectl apply` para aplicar la nueva topología al clúster EKS, asegurando actualizaciones limpias sin tiempo de inactividad (Zero Downtime).

---

## 🔧 Resolución de Problemas (Troubleshooting)

### Hito Técnico: Proxy Reverso en el Frontend (Error 405 Method Not Allowed)

Durante la integración final entre el Frontend y el API Gateway en Kubernetes, nos enfrentamos a bloqueos de red donde las peticiones del navegador (como el Login) fallaban.

**El Diagnóstico:** Nginx, operando en el contenedor del Frontend, estaba diseñado para servir archivos estáticos (SPA). Al recibir una petición `POST` hacia la ruta `/api/auth/login`, Nginx no sabía cómo procesarla y respondía con un error `405 Method Not Allowed`, lo cual también causaba aparentes errores de CORS en el cliente.

**La Solución:** En lugar de exponer el backend directamente, implementamos un **Reverse Proxy interno**. Modificamos la configuración de Nginx (`nginx.conf`) agregando una regla `proxy_pass` en el bloque `location /api/`. Esto instruyó a Nginx a actuar como puente transparente, enrutando todo el tráfico de la API de forma privada hacia el servicio del BFF dentro de la red del clúster de Kubernetes, resolviendo instantáneamente los bloqueos de red y aumentando la seguridad general de la topología.

---

## 🤖 Uso de Inteligencia Artificial (Gemini)

La integración de herramientas de Inteligencia Artificial (Gemini) fue fundamental como "Pair Programmer" a lo largo del ciclo de vida del proyecto:

1. **Ingeniería Cloud:** Soporte activo durante el troubleshooting de infraestructura para migrar exitosamente la arquitectura hacia Amazon EKS.
2. **Depuración (Debugging):** Asistencia analítica en la lectura de logs y depuración de comandos complejos ejecutados en AWS CloudShell.
3. **Infraestructura como Código:** Generación y validación de la estructura base para los manifiestos YAML de Kubernetes (Deployments, Services, ConfigMaps y Secrets).
4. **Networking:** Asistencia en el diseño e implementación de la reconfiguración avanzada de Nginx para resolver problemas de enrutamiento HTTP y CORS en un entorno aislado de clúster.

---
