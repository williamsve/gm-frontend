# Sistema de Autenticación - Panel de Administración

## 📋 Resumen

Se ha implementado un sistema de autenticación completo para proteger los endpoints de la API y las rutas del panel de administración.

## 🔐 Características Implementadas

### 1. **Autenticación JWT**
- Tokens JWT con expiración de 24 horas
- Almacenamiento seguro en cookies HttpOnly
- Verificación automática de tokens

### 2. **Endpoints de Autenticación**

#### `POST /api/auth/login`
- **Descripción**: Iniciar sesión
- **Body**: `{ username: string, password: string }`
- **Respuesta**: `{ success: boolean, user: object, token: string }`
- **Cookies**: Establece `auth_token` (HttpOnly, 24h)

#### `POST /api/auth/logout`
- **Descripción**: Cerrar sesión
- **Respuesta**: `{ success: boolean, message: string }`
- **Cookies**: Elimina `auth_token`

#### `GET /api/auth/me`
- **Descripción**: Verificar sesión activa
- **Headers**: `Authorization: Bearer <token>` (opcional)
- **Cookies**: `auth_token` (opcional)
- **Respuesta**: `{ success: boolean, user: object }`

### 3. **Protección de Rutas**

#### Middleware (`middleware.js`)
- Protege todas las rutas `/admin/*` excepto `/admin/login`
- Redirige a `/admin/login` si no hay sesión activa
- Verifica validez del token JWT

#### Protección de Endpoints API
- **GET /api/servicios**: Público (sin autenticación)
- **POST /api/servicios**: Requiere autenticación
- **PUT /api/servicios/[id]**: Requiere autenticación
- **DELETE /api/servicios/[id]**: Requiere autenticación

### 4. **Componentes Frontend**

#### `useAuth` Hook
```javascript
const { user, login, logout, isAuthenticated, loading } = useAuth()
```

**Funciones:**
- `login(username, password)`: Iniciar sesión
- `logout()`: Cerrar sesión
- `isAuthenticated`: Booleano de estado
- `user`: Objeto usuario actual
- `loading`: Estado de carga

#### `AuthProvider`
- Contexto de autenticación global
- Envuelve la aplicación en `_app.js`
- Maneja estado de sesión automáticamente

### 5. **Página de Login**
- URL: `/admin/login`
- Campos: Usuario y Contraseña
- Validación en tiempo real
- Manejo de errores
- Redirección automática si ya está autenticado

### 6. **Sidebar con Logout**
- Muestra información del usuario actual
- Botón de cerrar sesión
- Icono de usuario

## 🚀 Uso

### Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Ejemplo de Uso en Componentes

```javascript
import { useAuth } from '../../lib/useAuth'

export default function MiComponente() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/admin/login'
  }

  return (
    <div>
      <p>Bienvenido, {user?.username}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  )
}
```

### Ejemplo de Petición Autenticada

```javascript
// Las cookies se envían automáticamente con credentials: 'include'
const response = await fetch('/api/servicios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Importante para enviar cookies
  body: JSON.stringify(data)
})

if (response.status === 401) {
  // Sesión expirada, redirigir a login
  window.location.href = '/admin/login'
}
```

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
- `lib/auth.js` - Funciones de autenticación
- `lib/useAuth.js` - Hook de autenticación
- `pages/api/auth/login.js` - Endpoint de login
- `pages/api/auth/logout.js` - Endpoint de logout
- `pages/api/auth/me.js` - Endpoint de verificación
- `middleware.js` - Middleware de protección de rutas

### Archivos Modificados
- `pages/_app.js` - Agregado AuthProvider
- `pages/admin/login.js` - Implementación real de login
- `pages/api/servicios/index.js` - Protección POST
- `pages/api/servicios/[id].js` - Protección PUT/DELETE
- `components/admin/sections/Servicios.js` - Envío de cookies
- `components/admin/AdminSidebar.js` - Botón de logout

## 🔒 Seguridad

### Medidas Implementadas
1. **Contraseñas hasheadas** con bcrypt (10 rounds)
2. **JWT con expiración** (24 horas)
3. **Cookies HttpOnly** (no accesibles desde JavaScript)
4. **SameSite=Strict** (protección CSRF)
5. **Secure flag** en producción
6. **Verificación de token** en cada petcción protegida

### Mejoras Futuras Recomendadas
1. Implementar refresh tokens
2. Agregar rate limiting
3. Implementar 2FA (autenticación de dos factores)
4. Logging de intentos de acceso fallidos
5. Bloqueo de cuenta después de X intentos fallidos

## 🧪 Testing

### Probar Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Probar Endpoint Protegido
```bash
# Sin autenticación (debería retornar 401)
curl -X POST http://localhost:3000/api/servicios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","descripcion":"Test"}'

# Con autenticación (usar cookie del login anterior)
curl -X POST http://localhost:3000/api/servicios \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=TOKEN_AQUI" \
  -d '{"nombre":"Test","descripcion":"Test"}'
```

## 📝 Notas

- El sistema usa LowDB para almacenar usuarios (adecuado para desarrollo)
- Para producción, considerar migrar a PostgreSQL
- Las cookies son HttpOnly para prevenir ataques XSS
- El middleware protege todas las rutas /admin/* automáticamente
- El token se renueva en cada login exitoso
