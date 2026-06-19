# Proyecto Next.js - Global Mantenimiento C.A.

Este repositorio contiene la aplicación web de Global Mantenimiento C.A., desarrollada con Next.js (routing `pages/`) usando Tailwind CSS. Es una aplicación frontend standalone sin dependencias de backend.

## Arquitectura

- **Frontend**: Next.js 14 con Tailwind CSS v3
- **Multi-idioma**: Soporte para ES, EN, FR, DE, IT, PT
- **Despliegue**: Vercel (frontend estático)

## Estado Actual

- Next.js con routing `pages/`
- Tailwind CSS (v3) configurado
- Componentes principales: `Header`, `Hero`, `Services`, `Works`, `Testimonials`, `Footer`, `ContactCTA`
- Soporte para múltiples idiomas (i18n)
- Sin dependencias de backend (API externa configurada)

## Configuración Inicial

### 1. Configurar API Externa (Opcional)

Si deseas conectar con una API externa, configura la variable:

```
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 2. Instalar Dependencias

```powershell
pnpm install
```

### 3. Ejecutar en Desarrollo

```powershell
pnpm dev
```

Abre en el navegador: http://localhost:3000

## Cómo Ejecutar (Local)

### Desarrollo

```powershell
pnpm dev
```

### Producción (Build)

```powershell
pnpm build
pnpm start
```

### Limpiar Build

```powershell
pnpm clean
```

## Estructura del Proyecto

```
gm-frontend/
├── components/          # Componentes React
│   ├── shared/         # Componentes compartidos
│   └── ui/             # Componentes UI
├── lib/                # Utilidades
│   └── i18n.js         # Configuración multi-idioma
├── pages/              # Rutas de Next.js
├── i18n/messages/      # Traducciones por idioma
└── public/             # Archivos estáticos
```

## Despliegue a Vercel

1. Vercel detecta automáticamente Next.js
2. Sube este repo y configura el proyecto en Vercel
3. Usa `pnpm` como package manager

## Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL de la API externa (opcional) | No |

## Siguientes Pasos Sugeridos

- Revisar y pulir estilos Tailwind
- Añadir más tests unitarios
- Configurar pipeline de CI/CD
