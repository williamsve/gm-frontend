# Guía de Migración a la API FastAPI

## 📋 Resumen

Este documento describe la migración del frontend Next.js para usar la nueva API FastAPI de Global Mantenimiento.

## 🏗️ Arquitectura

### Pilares Fundamentales

1. **Configuración Centralizada** - Todos los endpoints y configuraciones en un solo lugar
2. **Autenticación JWT** - Manejo seguro de tokens de acceso
3. **Manejo de Errores Consistente** - Mensajes de error claros y uniformes
4. **Cliente API Reutilizable** - Funciones para GET, POST, PUT, DELETE
5. **Hooks de React** - Integración con SWR para caching y revalidación

## 📁 Nuevos Archivos

### `lib/apiConfig.js`
Configuración centralizada de la API:
- URL base de la API
- Endpoints organizados por recurso
- Headers por defecto
- Códigos de estado HTTP
- Mensajes de error personalizados

### `lib/apiClient.js`
Cliente HTTP con autenticación JWT:
- Gestión de tokens (get, set, remove)
- Funciones: `apiGet`, `apiPost`, `apiPut`, `apiDelete`
- Manejo automático de headers de autenticación
- Parseo de respuestas y errores

## 🔄 Archivos Modificados

### `lib/useApi.js`
- Actualizado para usar el nuevo cliente API
- Agregados hooks individuales por recurso:
  - `useServicios()` - Lista de servicios
  - `useServicio(id)` - Servicio por ID
  - `useProyectos()` - Lista de proyectos
  - `useProyecto(id)` - Proyecto por ID
  - `useTestimonios()` - Lista de testimonios
  - `useTestimonio(id)` - Testimonio por ID
  - `useTrabajos()` - Lista de trabajos
  - `useTrabajo(id)` - Trabajo por ID

### `lib/useAuth.js`
- Migrado de API routes de Next.js a API FastAPI
- Soporte para login con form-data (endpoint principal)
- Soporte para login con JSON (endpoint alternativo)
- Verificación automática de token al cargar
- Propiedades adicionales: `isAdmin`, `register`

### `.env.local`
- Agregada variable `NEXT_PUBLIC_API_URL=http://localhost:8000`

## 🚀 Cómo Usar

### 1. Configurar la URL de la API

En `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Para producción:
```env
NEXT_PUBLIC_API_URL=https://tu-api-produccion.com
```

### 2. Iniciar la API FastAPI

```bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Usar los Hooks

#### Autenticación
```javascript
import { useAuth } from '../lib/useAuth'

function LoginComponent() {
  const { login, logout, isAuthenticated, user } = useAuth()
  
  const handleLogin = async () => {
    const result = await login('admin', 'admin123')
    if (result.success) {
      // Login exitoso
    }
  }
}
```

#### Obtener Datos
```javascript
import { useServicios } from '../lib/useApi'

function ServiciosList() {
  const { data: servicios, isLoading, error } = useServicios()
  
  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar</div>
  
  return (
    <ul>
      {servicios.map(servicio => (
        <li key={servicio.id}>{servicio.nombre}</li>
      ))}
    </ul>
  )
}
```

#### Peticiones Directas
```javascript
import { apiPost, apiPut, apiDelete } from '../lib/apiClient'

// Crear
await apiPost('/api/servicios', { nombre: 'Nuevo', descripcion: '...' })

// Actualizar
await apiPut('/api/servicios/1', { nombre: 'Actualizado', descripcion: '...' })

// Eliminar
await apiDelete('/api/servicios/1')
```

## 🔐 Autenticación

### Flujo de Login

1. Usuario envía credenciales
2. API FastAPI valida y retorna JWT
3. Frontend almacena token en `localStorage`
4. Token se envía automáticamente en peticiones posteriores
5. Al cerrar sesión, se elimina el token

### Endpoints de Autenticación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login con form-data |
| `/api/auth/login/json` | POST | Login con JSON |
| `/api/auth/me` | GET | Obtener usuario actual |
| `/api/auth/register` | POST | Registrar usuario (admin) |
| `/api/auth/logout` | POST | Cerrar sesión |

## 📊 Endpoints de Recursos

### Servicios

| Endpoint | Método | Autenticación | Descripción |
|----------|--------|---------------|-------------|
| `/api/servicios/` | GET | No | Listar servicios |
| `/api/servicios/{id}` | GET | No | Obtener servicio |
| `/api/servicios/` | POST | Admin | Crear servicio |
| `/api/servicios/{id}` | PUT | Admin | Actualizar servicio |
| `/api/servicios/{id}` | DELETE | Admin | Eliminar servicio |

### Query Parameters (GET /api/servicios/)

- `skip`: Número de registros a saltar (default: 0)
- `limit`: Número máximo de registros (default: 100, max: 1000)
- `search`: Buscar por nombre o descripción

## ⚠️ Notas Importantes

### Compatibilidad

- Los hooks mantienen la misma API que antes
- Los componentes existentes no necesitan cambios mayores
- El manejo de errores es más robusto

### Diferencias con la API anterior

1. **Autenticación**: Ahora usa JWT en lugar de cookies
2. **Almacenamiento**: Token en `localStorage` en lugar de cookies
3. **Headers**: Se envía `Authorization: Bearer TOKEN`
4. **Respuestas**: Formato consistente de la API FastAPI

### Errores Comunes

1. **CORS**: Asegurar que la API tenga configurado `ALLOWED_ORIGINS`
2. **Token expirado**: Los tokens duran 24 horas
3. **Red**: Verificar que la API esté corriendo en el puerto correcto

## 🧪 Testing

### Verificar Conexión

```bash
# Verificar que la API responde
curl http://localhost:8000/docs

# Verificar autenticación
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### En el Frontend

1. Abrir DevTools > Network
2. Hacer login
3. Verificar que se envía `Authorization: Bearer ...`
4. Verificar que las respuestas son correctas

## 📝 Próximos Pasos

- [ ] Migrar endpoints de proyectos a la API FastAPI
- [ ] Migrar endpoints de testimonios a la API FastAPI
- [ ] Migrar endpoints de trabajos a la API FastAPI
- [ ] Implementar refresh token
- [ ] Agregar interceptor para renovación automática de token
- [ ] Implementar upload de imágenes en la API

## 🔗 Recursos

- [Documentación de la API](api/README.md)
- [Swagger UI](http://localhost:8000/docs) (cuando la API está corriendo)
- [ReDoc](http://localhost:8000/redoc) (documentación alternativa)
