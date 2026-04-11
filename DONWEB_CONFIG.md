# Configuración de Variables de Entorno en DonWeb

Para que el sitio funcione correctamente, necesitas configurar las siguientes variables de entorno en el panel de DonWeb:

## Variables requeridas

| Variable | Valor | Descripción |
|---------|------|------------|
| `NEXT_PUBLIC_API_URL` | `https://api.globalmantenimiento.site` | URL de la API backend |
| `JWT_SECRET` | `tu-jwt-secret-muy-seguro-produccion-2024` | Clave secreta para JWT (cambiar por una más segura) |

## Cómo configurar en DonWeb

1. Inicia sesión en el panel de DonWeb
2. Ve a **Configuración** o **Variables de Entorno**
3. Agrega cada variable con su valor correspondiente
4. Guarda los cambios

## Nota importante

El archivo `.env.production` NO debe subirse al repositorio por seguridad (ya está en `.gitignore`). Las variables deben configurarse directamente en el panel del hosting.

## Alternativa: Deployment automático

Si DonWeb tiene integración con GitHub:
1. Conecta tu repositorio `gm-frontend`
2. Configura el comando de build: `pnpm build`
3. Especifica la carpeta de salida: `public_html`
4. DonWeb ejecutará el build automáticamente