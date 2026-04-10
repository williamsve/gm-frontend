# Migración de Base de Datos: imagen → imagenes

## Resumen

Se ha completado la migración de la base de datos para soportar múltiples imágenes en la tabla `trabajos`.

## Cambios Realizados

### 1. Base de Datos
- **Columna renombrada**: `imagen` → `imagenes`
- **Tipo de dato cambiado**: `String` → `JSON`
- **Migración de datos**: Los datos existentes se convirtieron automáticamente de string a array

### 2. Script de Migración
- **Archivo**: [`api/migrations/migrate_imagen_to_imagenes.py`](api/migrations/migrate_imagen_to_imagenes.py)
- **Funcionalidad**:
  - Verifica si la columna `imagen` existe
  - Agrega nueva columna `imagenes` como JSON
  - Migra datos existentes de string a array
  - Elimina la columna antigua `imagen`

## Estado Actual

✅ **Migración completada exitosamente**
- La columna `imagenes` ahora es de tipo JSON
- El backend acepta arrays de URLs de imágenes
- El frontend está configurado correctamente para enviar múltiples imágenes
- **Fix de autenticación**: Se agregó token de autenticación en la petición de upload de imágenes

## Flujo de Funcionamiento

### Frontend ([`TrabajoForm.js`](components/admin/sections/TrabajoForm.js))
1. Usuario selecciona múltiples imágenes (máximo 10)
2. Se validan tipo de archivo y tamaño (máximo 5MB cada una)
3. Se suben al endpoint `/api/upload/imagenes` usando FormData
4. Se reciben URLs de respuesta
5. Se envían las URLs como array JSON al crear/actualizar trabajo

### Backend
1. **Endpoint de upload** ([`api/app/routers/upload.py`](api/app/routers/upload.py)):
   - Recibe archivos multipart/form-data
   - Valida tipo y tamaño
   - Guarda archivos en `public/uploads/trabajos/`
   - Retorna array de URLs

2. **Endpoint de trabajos** ([`api/app/routers/trabajos.py`](api/app/routers/trabajos.py)):
   - Recibe datos JSON con campo `imagenes` como array
   - Almacena en base de datos como JSON
   - Retorna datos con array de URLs

## Estructura de Datos

### Frontend envía:
```json
{
  "nombre": "Trabajo ejemplo",
  "descripcion": "Descripcion del trabajo",
  "cliente": "Nombre del cliente",
  "fecha_inicio": "2026-03-30T00:00:00",
  "tipo_servicio": "categoria",
  "estado": "completado",
  "imagenes": [
    "/uploads/trabajos/uuid1.jpg",
    "/uploads/trabajos/uuid2.jpg"
  ]
}
```

### Backend responde:
```json
{
  "id": 1,
  "nombre": "Trabajo ejemplo",
  "descripcion": "Descripcion del trabajo",
  "cliente": "Nombre del cliente",
  "fecha_inicio": "2026-03-30T00:00:00",
  "tipo_servicio": "categoria",
  "estado": "completado",
  "imagenes": [
    "/uploads/trabajos/uuid1.jpg",
    "/uploads/trabajos/uuid2.jpg"
  ],
  "is_active": true,
  "created_at": "2026-03-30T16:43:20.303362Z",
  "updated_at": null
}
```

## Cómo Probar

### Prueba Manual
1. Iniciar sesión en el panel de administración
2. Ir a la sección **Trabajos**
3. Hacer clic en **Nuevo Trabajo**
4. Completar el formulario:
   - Nombre del trabajo
   - Cliente
   - Fecha del trabajo
   - Descripción
   - Subir una o más imágenes (máximo 10)
5. Hacer clic en **Guardar**
6. Verificar que:
   - Las imágenes se suban correctamente
   - El trabajo se cree con las imágenes asociadas
   - Al editar el trabajo, las imágenes se muestren correctamente

### Prueba con Script
```bash
cd api
python test_upload_flow.py
```

## Archivos Modificados

1. **Base de datos**: Tabla `trabajos`
   - Columna `imagen` eliminada
   - Columna `imagenes` agregada (tipo JSON)

2. **Scripts creados**:
   - [`api/migrations/migrate_imagen_to_imagenes.py`](api/migrations/migrate_imagen_to_imagenes.py) - Script de migración
   - [`api/test_upload_flow.py`](api/test_upload_flow.py) - Script de verificación

3. **Frontend corregido**:
   - [`components/admin/sections/Trabajos.js`](components/admin/sections/Trabajos.js:81-86) - Se agregó token de autenticación en la petición de upload de imágenes

## Notas Importantes

- El frontend ya estaba configurado para manejar múltiples imágenes
- El problema era únicamente la desincronización entre el modelo Python y la base de datos
- La migración es irreversible (se eliminó la columna antigua)
- Los archivos de imágenes se guardan en `api/public/uploads/trabajos/`
- Las URLs son relativas y se acceden desde el frontend

## Verificación

Para verificar que todo funciona correctamente:

```bash
# Verificar endpoint de trabajos
curl http://localhost:8000/api/trabajos/

# Respuesta esperada:
{
  "items": [
    {
      "id": 1,
      "nombre": "trabajo 1",
      "imagenes": [],
      ...
    }
  ],
  "total": 1
}
```

## Conclusión

✅ La base de datos ahora está adecuada para recibir múltiples imágenes
✅ El flujo de información funciona correctamente
✅ Frontend y backend están sincronizados
