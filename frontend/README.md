# Frontend — VraKBen-CORP

Aplicación web React moderna para el sistema de gestión del taller VraKBen-CORP. Interfaz premium con modo oscuro/claro, métricas interactivas y vistas diferenciadas por rol.

## Stack

- **React 18** + **Vite**
- **React Router v6** (SPA con rutas protegidas por rol)
- **Axios** con interceptores JWT automáticos
- **Recharts** para gráficas de métricas
- **Lucide React** para iconos
- **CSS puro** (sin frameworks)
- **Vitest + React Testing Library** para pruebas unitarias y de componentes

## Arrancar en Desarrollo

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Testing (Vitest)

El frontend incluye **29 pruebas unitarias y de integración** que aseguran la correcta funcionalidad de la lógica de negocio y componentes clave. Los servicios (comunicación con el API Gateway) tienen **100% de cobertura**.

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas y generar reporte de cobertura
npm run test:coverage
```

## Estructura de Carpetas

```
src/
├── App.jsx                  # Rutas principales + AuthProvider
├── index.css                # Estilos globales
├── components/
│   ├── Navbar.jsx           # Barra de navegación adaptada por rol
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx   # Guard de rutas por rol
├── context/
│   └── AuthContext.jsx      # Estado global de sesión (JWT + user)
├── pages/
│   ├── Home.jsx             # Landing page pública
│   ├── Catalogo.jsx         # Tienda de repuestos (pública, con carrito si logueado)
│   ├── Login.jsx            # Formulario de login
│   ├── Register.jsx         # Formulario de registro
│   ├── Perfil.jsx           # Perfil de usuario (foto, datos, vehículos)
│   ├── Carrito.jsx          # Carrito de compras
│   ├── Agendar.jsx          # Agendamiento de citas
│   ├── Pago.jsx             # Proceso de pago (en desarrollo)
│   ├── admin/
│   │   ├── Metricas.jsx     # Dashboard con gráficas Recharts (datos reales)
│   │   ├── GestInv.jsx      # Gestión del catálogo de repuestos
│   │   ├── GestUser.jsx     # Búsqueda y gestión de usuarios
│   │   └── GestSolicitudes.jsx  # Aprobar/rechazar solicitudes de mecánicos
│   └── mechanic/
│       ├── DashMec.jsx      # Panel de órdenes de trabajo del mecánico
│       ├── InvMec.jsx       # Vista de inventario para mecánicos
│       └── Solicitud.jsx    # Crear solicitud de material al proveedor
└── services/
    ├── apiClient.js         # Axios con baseURL=http://localhost:8080 + interceptores JWT
    ├── authService.js       # loginUser(), registerUser()
    ├── catalogoService.js   # obtenerProductos(), crearProducto()
    └── carritoService.js    # agregarAlCarrito()
```

## Rutas de la Aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Home | Público |
| `/tienda` | Catalogo | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/carrito` | Carrito | CLIENTE, ADMIN |
| `/pago` | Pago | CLIENTE |
| `/agendar` | Agendar | CLIENTE |
| `/perfil` | Perfil | CLIENTE, MECANICO, ADMIN |
| `/mecanico/dashboard` | DashMec | MECANICO |
| `/mecanico/inventario` | InvMec | MECANICO |
| `/mecanico/solicitud` | Solicitud | MECANICO |
| `/admin/metricas` | Metricas | ADMIN |
| `/admin/inventario` | GestInv | ADMIN |
| `/admin/usuarios` | GestUser | ADMIN |
| `/admin/solicitudes` | GestSolicitudes | ADMIN |

## Comunicación con el Backend

Toda la comunicación pasa por `apiClient.js`, que apunta al API Gateway (`http://localhost:8080`):

```js
// El interceptor de REQUEST agrega el JWT automáticamente
config.headers['Authorization'] = `Bearer ${token}`;

// El interceptor de RESPONSE limpia la sesión si recibe 401
if (error.response?.status === 401) {
  localStorage.clear();
  window.location.href = '/login';
}
```

## Perfil de Usuario

El perfil (`/perfil`) soporta:
- **Foto de perfil:** Subida desde el PC, guardada en `localStorage` por usuario
- **Datos editables:** Nombre y correo guardados en `localStorage` por usuario
- **Vehículos:** Tabla con patentes formato chileno (ABCD-12), datos en `localStorage` por usuario
- **Patentes chilenas:** Función `formatPatente()` convierte automáticamente al formato nacional

## Variables de Entorno

Crea un `.env` en la carpeta `frontend/` si necesitas cambiar la URL del gateway:

```env
VITE_API_GATEWAY_URL=http://localhost:8080
```

## Build de Producción

```bash
npm run build
# → Genera carpeta dist/
```
