# Plan de Implementación - Panel de Administración

## 📋 Estado Actual del Proyecto

### Tecnologías Existentes
- **Framework**: Next.js (latest)
- **Base de Datos**: LowDB (JSON file-based) en `lib/db.js`
- **Estilos**: Tailwind CSS 3.4.19
- **Animaciones**: Framer Motion 12.34.3
- **Iconos**: React Icons 4.11.0
- **HTTP Client**: SWR 2.4.1
- **Autenticación**: JWT_SECRET configurado en `.env.local`

### APIs Existentes (Solo GET)
- `/api/proyectos` - Listar proyectos
- `/api/proyectos/[id]` - Obtener proyecto por ID
- `/api/servicios` - Listar servicios
- `/api/servicios/[id]` - Obtener servicio por ID
- `/api/testimonios` - Listar testimonios
- `/api/testimonios/[id]` - Obtener testimonio por ID
- `/api/trabajos` - Listar trabajos
- `/api/trabajos/[id]` - Obtener trabajo por ID

### Estructura de Base de Datos (LowDB)
```javascript
{
  users: [],
  trabajos: [],
  testimonios: [],
  proyectos: [],
  servicios: []
}
```

---

## 🎯 Objetivo del Panel de Administración

Crear un panel de administración completo que permita:
1. Autenticación de usuarios (login/logout)
2. CRUD completo para: Proyectos, Servicios, Testimonios, Trabajos
3. Dashboard con estadísticas
4. Interfaz de usuario moderna y responsive

---

## 🏗️ Estructura de Tecnologías a Implementar

### 1. Autenticación
- **JWT (JSON Web Tokens)** para manejo de sesiones
- **bcrypt** para hash de contraseñas
- **Iron Session** o **JWT** para manejo de cookies seguras
- Librería recomendada: `jsonwebtoken` y `bcryptjs`

### 2. APIs Backend (CRUD Completo)
Para cada entidad (proyectos, servicios, testimonios, trabajos):
- `POST /api/[entidad]` - Crear nuevo registro
- `PUT /api/[entidad]/[id]` - Actualizar registro existente
- `DELETE /api/[entidad]/[id]` - Eliminar registro

### 3. Frontend del Panel de Administración
- **Páginas**:
  - `/admin/login` - Página de inicio de sesión
  - `/admin` - Dashboard principal con estadísticas
  - `/admin/proyectos` - Listar proyectos
  - `/admin/proyectos/crear` - Crear nuevo proyecto
  - `/admin/proyectos/[id]` - Editar proyecto existente
  - `/admin/servicios` - Listar servicios
  - `/admin/servicios/crear` - Crear nuevo servicio
  - `/admin/servicios/[id]` - Editar servicio existente
  - `/admin/testimonios` - Listar testimonios
  - `/admin/testimonios/crear` - Crear nuevo testimonio
  - `/admin/testimonios/[id]` - Editar testimonio existente
  - `/admin/trabajos` - Listar trabajos
  - `/admin/trabajos/crear` - Crear nuevo trabajo
  - `/admin/trabajos/[id]` - Editar trabajo existente

### 4. Componentes Reutilizables
- `AdminLayout` - Layout base para todas las páginas admin
- `AdminSidebar` - Menú lateral de navegación
- `AdminHeader` - Header con información del usuario y logout
- `DataTable` - Tabla genérica para listados
- `FormularioBase` - Formulario genérico para crear/editar
- `Modal` - Modal para confirmaciones
- `Toast` - Notificaciones de éxito/error

### 5. Middleware de Protección
- Middleware para verificar autenticación en rutas `/admin/*`
- Redirección a login si no está autenticado

---

## 📁 Estructura de Archivos a Crear

```
├── components/
│   └── admin/
│       ├── AdminLayout.js
│       ├── AdminSidebar.js
│       ├── AdminHeader.js
│       ├── DataTable.js
│       ├── FormularioBase.js
│       ├── Modal.js
│       └── Toast.js
├── lib/
│   ├── auth.js          # Funciones de autenticación
│   └── api-helpers.js   # Helpers para APIs
├── pages/
│   ├── admin/
│   │   ├── login.js     # Página de login
│   │   ├── index.js     # Dashboard
│   │   ├── proyectos/
│   │   │   ├── index.js
│   │   │   ├── crear.js
│   │   │   └── [id].js
│   │   ├── servicios/
│   │   │   ├── index.js
│   │   │   ├── crear.js
│   │   │   └── [id].js
│   │   ├── testimonios/
│   │   │   ├── index.js
│   │   │   ├── crear.js
│   │   │   └── [id].js
│   │   └── trabajos/
│   │       ├── index.js
│   │       ├── crear.js
│   │       └── [id].js
│   └── api/
│       ├── auth/
│       │   ├── login.js
│       │   ├── logout.js
│       │   └── me.js
│       ├── proyectos/
│       │   ├── index.js  (actualizar para soportar POST)
│       │   └── [id].js   (actualizar para soportar PUT/DELETE)
│       ├── servicios/
│       │   ├── index.js  (actualizar para soportar POST)
│       │   └── [id].js   (actualizar para soportar PUT/DELETE)
│       ├── testimonios/
│       │   ├── index.js  (actualizar para soportar POST)
│       │   └── [id].js   (actualizar para soportar PUT/DELETE)
│       └── trabajos/
│           ├── index.js  (actualizar para soportar POST)
│           └── [id].js   (actualizar para soportar PUT/DELETE)
└── middleware.js          # Middleware de protección de rutas
```

---

## 📦 Dependencias Adicionales Necesarias

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cookie": "^0.5.0"
  }
}
```

---

## 🔄 Orden de Implementación (Paso a Paso)

### Fase 1: Configuración Base
1. Instalar dependencias adicionales
2. Crear librería de autenticación (`lib/auth.js`)
3. Crear middleware de protección de rutas
4. Crear componente `AdminLayout`

### Fase 2: Sistema de Autenticación
5. Crear API de login (`/api/auth/login`)
6. Crear API de logout (`/api/auth/logout`)
7. Crear API de verificación (`/api/auth/me`)
8. Crear página de login (`/admin/login`)

### Fase 3: Dashboard
9. Crear componente `AdminSidebar`
10. Crear componente `AdminHeader`
11. Crear página dashboard (`/admin/index`)

### Fase 4: Componentes CRUD Genéricos
12. Crear componente `DataTable`
13. Crear componente `FormularioBase`
14. Crear componente `Modal`
15. Crear componente `Toast`

### Fase 5: CRUD de Proyectos
16. Actualizar API de proyectos (POST, PUT, DELETE)
17. Crear página listado proyectos (`/admin/proyectos`)
18. Crear página crear proyecto (`/admin/proyectos/crear`)
19. Crear página editar proyecto (`/admin/proyectos/[id]`)

### Fase 6: CRUD de Servicios
20. Actualizar API de servicios (POST, PUT, DELETE)
21. Crear página listado servicios (`/admin/servicios`)
22. Crear página crear servicio (`/admin/servicios/crear`)
23. Crear página editar servicio (`/admin/servicios/[id]`)

### Fase 7: CRUD de Testimonios
24. Actualizar API de testimonios (POST, PUT, DELETE)
25. Crear página listado testimonios (`/admin/testimonios`)
26. Crear página crear testimonio (`/admin/testimonios/crear`)
27. Crear página editar testimonio (`/admin/testimonios/[id]`)

### Fase 8: CRUD de Trabajos
28. Actualizar API de trabajos (POST, PUT, DELETE)
29. Crear página listado trabajos (`/admin/trabajos`)
30. Crear página crear trabajo (`/admin/trabajos/crear`)
31. Crear página editar trabajo (`/admin/trabajos/[id]`)

### Fase 9: Refinamiento
32. Agregar validaciones de formulario
33. Mejorar estilos y UX
34. Agregar manejo de errores
35. Testing y corrección de bugs

---

## 🔐 Seguridad Considerada

1. **Contraseñas**: Hasheadas con bcrypt antes de almacenar
2. **JWT**: Tokens con expiración (24h recomendado)
3. **Cookies**: HttpOnly, Secure en producción
4. **Validación**: Sanitización de inputs en backend
5. **CORS**: Configurado solo para el dominio permitido
6. **Middleware**: Protección de todas las rutas `/admin/*`

---

## 📝 Notas Importantes

- La base de datos actual es LowDB (JSON file), adecuada para desarrollo
- Para producción se podría migrar a PostgreSQL (ya configurado en .env.local)
- El sistema de autenticación debe ser simple pero seguro
- Todas las páginas del admin deben ser responsive
- Usar Tailwind CSS para mantener consistencia con el sitio público
